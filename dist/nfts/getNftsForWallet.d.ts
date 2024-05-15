import { DigitalAsset } from "@metaplex-foundation/mpl-token-metadata";
import { DasApiAsset, SolanaEnv } from "../../src/types";
export declare function getAssetsForWallet(address: string, rpc?: string, env?: SolanaEnv, das?: boolean): Promise<DasApiAsset[] | DigitalAsset[] | Error>;
