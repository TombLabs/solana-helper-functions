import { AnchorWallet, WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, Keypair, Transaction, VersionedTransaction } from "@solana/web3.js";
import { TransactionResult } from "../../src/types";
export declare function sendAndConfirmAllSmartTransactions(signer: WalletContextState | AnchorWallet | Keypair, transactions: (Transaction | VersionedTransaction)[], connection: Connection, maxFee?: number): Promise<TransactionResult[]>;
