import { AnchorWallet, WalletContextState } from "@solana/wallet-adapter-react";
import { ComputeBudgetProgram, Connection, Keypair, RpcResponseAndContext, SimulatedTransactionResponse, Transaction, TransactionMessage, VersionedMessage, VersionedTransaction } from "@solana/web3.js";
import { TransactionResult } from "../../src/types";
import { addComputeAndPriority, sendAndConfirmTransactions } from "./utils";

/**
 * Sends and confirms all transactions in a batch.  This function will simulate all transactions in the batch and add compute and priority instructions to each transaction.  It will then send and confirm all transactions in the batch.
 * @param {WalletContextState | AnchorWallet | Keypair} signer The wallet used to send the transactions.
 * @param {Transaction[] | VersionedTransaction[]} transactions The transactions to send and confirm.
 * @param {Connection} connection The Solana RPC connection to use.
 * @param {Number} [maxFee=0.00002] The maximum fee to pay for each transaction. Default is 20000 lamports represented in SOL (0.00002).
 * @returns {TransactionResult[]} Returns an array of transaction results including the transaction id, error status, and message.
 */

export async function sendAndConfirmAllSmartTransactions(signer: WalletContextState | AnchorWallet | Keypair, transactions: (Transaction | VersionedTransaction)[], connection: Connection, maxFee?: number): Promise<TransactionResult[]> {

    //loop through and simulate all transactions
    for (let tx of transactions) {
        tx = await addComputeAndPriority(tx, connection, signer.publicKey, maxFee ? maxFee : 0.00002);
    }

    const blockhash = await connection.getLatestBlockhash();

    const results = await sendAndConfirmTransactions(connection, transactions, signer, blockhash.blockhash);

    return results

}