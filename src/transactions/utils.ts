import { Wallet } from "@coral-xyz/anchor";
import { AnchorWallet, WalletContextState } from "@solana/wallet-adapter-react";
import { Blockhash, ComputeBudgetProgram, Connection, Keypair, PublicKey, RpcResponseAndContext, SimulatedTransactionResponse, Transaction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { TransactionResult } from "../../src/types";



export async function addComputeAndPriority(tx: VersionedTransaction | Transaction, connection: Connection, feePayer: PublicKey, maxFee: number = 0.00002) {
    let simulation: RpcResponseAndContext<SimulatedTransactionResponse>
    if (tx instanceof Transaction) {
        tx.feePayer = feePayer;
        simulation = await connection.simulateTransaction(tx as Transaction);
    } else {
        simulation = await connection.simulateTransaction(tx as VersionedTransaction);
    }

    const compute = simulation.value.unitsConsumed;

    //add 500 compute units for padding
    const maxCompute = compute + 500;


    const priorityFeeSol = maxFee / maxCompute;
    const feeLamports = Math.floor(priorityFeeSol * 10 ** 9);
    const microLamports = feeLamports * 10 ** 6;

    const expectedFee = maxCompute * (microLamports / 10 ** 6);
    console.log("Expected fee: ", expectedFee / 10 ** 9, " SOL");

    const ixToAdd = [
        ComputeBudgetProgram.setComputeUnitLimit({
            units: maxCompute
        }),
        ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: microLamports
        })
    ]

    if (tx instanceof Transaction) {
        tx.add(...ixToAdd);
    } else {
        const message = TransactionMessage.decompile(tx.message);
        message.instructions.unshift(...ixToAdd);
        tx.message = message.compileToV0Message()
    }
    return tx
}

export async function sendAndConfirmTransactions(connection: Connection, transactions: (Transaction | VersionedTransaction)[], signer: Keypair | AnchorWallet | WalletContextState, blockhash: Blockhash): Promise<TransactionResult[]> {

    const results: string[] = await Promise.all(transactions.map(async (tx) => {
        const wallet = signer instanceof Keypair ? new Wallet(signer) : signer as WalletContextState | AnchorWallet;

        if (tx instanceof Transaction) {
            tx.recentBlockhash = blockhash;
            tx.feePayer = wallet.publicKey;
            const signedTx = await wallet.signTransaction(tx);
            const txid = await connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: true, preflightCommitment: 'confirmed' })
            return txid;
        } else {
            tx.message.recentBlockhash = blockhash;
            const signedTx = await wallet.signTransaction(tx);
            const txid = await connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: true, preflightCommitment: 'confirmed' })
            return txid;
        }
    }))

    let confirmations: TransactionResult[] = []
    let proceed = false;
    let retries = 0;
    const maxRetries = 8;

    while (!proceed) {
        await sleep(5000)
        const status = await connection.getSignatureStatuses(results);
        console.log(status)

        const value = status?.value
        if (retries > 10) {
            for (let i = 0; i < value.length; i++) {
                const v = value[i]
                if (v === null) {
                    confirmations.push({
                        signature: results[i],
                        error: true,
                        message: "Transaction dropped"
                    })
                } else if (v?.err !== null) {
                    confirmations.push({
                        signature: results[i],
                        error: true,
                        message: "Transaction failed"
                    })
                } else if (v?.confirmationStatus === "finalized" || v?.confirmationStatus === "confirmed") {
                    confirmations.push({
                        signature: results[i],
                        error: false,
                        message: "Transaction confirmed"
                    })
                } else {
                    confirmations.push({
                        signature: results[i],
                        error: true,
                        message: "Could not confirm transaction"
                    })
                }
                proceed = true
                break
            }
        }

        if (value.filter((v) => v?.confirmationStatus === "confirmed" || v?.confirmationStatus === "finalized").length === value.length) {
            proceed = true
            confirmations.push(...value.map((v, i) => {
                return {
                    signature: results[i],
                    error: false,
                    message: "Transaction confirmed"
                }
            }))
        } else if (value.filter((v) => v === null).length > 0 && retries < maxRetries) {
            //do nothing
        } else {
            for (let i = 0; i < value.length; i++) {
                const v = value[i]
                if (v === null) {
                    confirmations.push({
                        signature: results[i],
                        error: true,
                        message: "Transaction dropped"
                    })
                } else if (v?.err !== null) {
                    confirmations.push({
                        signature: results[i],
                        error: true,
                        message: "Transaction failed"
                    })
                } else if (v?.confirmationStatus === "finalized" || v?.confirmationStatus === "confirmed") {
                    confirmations.push({
                        signature: results[i],
                        error: false,
                        message: "Transaction confirmed"
                    })
                } else {
                    confirmations.push({
                        signature: results[i],
                        error: true,
                        message: "Could not confirm transaction"
                    })
                }
            }
            proceed = true
        }


        retries++
    }
    return confirmations
}

const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));