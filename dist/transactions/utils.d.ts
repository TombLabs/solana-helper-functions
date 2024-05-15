import { AnchorWallet, WalletContextState } from "@solana/wallet-adapter-react";
import { Blockhash, Connection, Keypair, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import { TransactionResult } from "../../src/types";
export declare function addComputeAndPriority(tx: VersionedTransaction | Transaction, connection: Connection, feePayer: PublicKey, maxFee?: number): Promise<Transaction | VersionedTransaction>;
export declare function sendAndConfirmTransactions(connection: Connection, transactions: (Transaction | VersionedTransaction)[], signer: Keypair | AnchorWallet | WalletContextState, blockhash: Blockhash): Promise<TransactionResult[]>;
