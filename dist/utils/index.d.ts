import { DigitalAsset } from "@metaplex-foundation/mpl-token-metadata";
import { DasApiAsset } from "../../src/types";
export declare function getAllDasNfts(address: string, rpc: string, verifiedOnly?: boolean): Promise<DasApiAsset[] | Error>;
export declare function getAllNfts(address: string, rpc: string): Promise<DigitalAsset[] | Error>;
export declare function isPublickey(address: string): {
    error: boolean;
    message: string;
};
