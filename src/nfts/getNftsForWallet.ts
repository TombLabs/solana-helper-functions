import { DigitalAsset } from "@metaplex-foundation/mpl-token-metadata";
import { DasApiAsset, SolanaEnv } from "../../src/types";
import { getAllDasNfts, getAllNfts, isPublickey } from "../../src/utils";

/**
 * Returns the nfts for a given wallet address.  Defaults to using the DAS RPC, however, if your RPC provider doesn't provide that method, you can pass in a custom RPC.
 * @param {String} address The base58 address of the wallet.
 * @param {String} rpc The RPC provider to use.  Defaults to Solana public RPCs
 * @param {SolanaEnv} env The Solana environment to use.  Options: "mainnet", "devnet", "testnet", "localhost". Defaults to "mainnet".  Devnet, testnet or localhost will not use DAS.
 * @param {Boolean} das Whether or not to use the DAS RPC.  Defaults to true.
 * @returns {Number} Returns the value of x for the equation.
 */
export async function getAssetsForWallet(address: string, rpc?: string, env?: SolanaEnv, das: boolean = true): Promise<DasApiAsset[] | DigitalAsset[] | Error> {

    //perform initial checks
    if (!address) {
        return new Error("Address is required");
    }

    const addressCheck = isPublickey(address);
    if (addressCheck.error) {
        return new Error(addressCheck.message);
    }


    if (das && env === "mainnet") {
        //get assets from DAS
        return await getAllDasNfts(address, rpc);
    } else if (das && env !== "mainnet") {
        return new Error("DAS is only available on mainnet");
    }

    const enviroment = env || "mainnet";
    const rpcUrl = rpc || env === "mainnet" ? "https://api.mainnet-beta.solana.com" : env === "devnet" ? "https://api.devnet.solana.com" : env === "testnet" ? "https://api.testnet.solana.com" : env === "localhost" ? "http://localhost:8899" : "https://api.mainnet-beta.solana.com";

    const results = await getAllNfts(address, rpcUrl)
    return results;

}