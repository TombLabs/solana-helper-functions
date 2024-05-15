import { DigitalAsset, fetchAllDigitalAssetByOwner, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata"
import { publicKey } from "@metaplex-foundation/umi"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import fetch from "isomorphic-unfetch"
import { DasApiAsset } from "../../src/types"

/**
 * Returns the nfts for a given wallet address. Using the DAS Specification
 * @param {String} address The base58 address of the wallet.
 * @param {String} rpc The RPC provider to use.  Defaults to Solana public RPCs
 * @param {Boolean} verifiedOnly Whether or not to return verified collections only.  Defaults to false.
 * @returns {Number} Returns the value of x for the equation.
 */
export async function getAllDasNfts(address: string, rpc: string, verifiedOnly: boolean = false): Promise<DasApiAsset[] | Error> {

    try {

        let page: number | boolean = 1
        let assets: DasApiAsset[] = []

        while (page) {
            const response = await fetch(rpc, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'getAssetsByOwner',
                    params: {
                        ownerAddress: address,
                        page: page,
                        limit: 100,
                        options: {
                            showUnverfifiedCollections: !verifiedOnly,
                        }
                    },
                }),
            })

            const data = await response.json()
            assets.push(...data.result.items)

            if (data.result.total !== 1000) {
                page = false
            } else {
                page++
            }
        }
        return assets
    } catch (error) {
        console.error(error)
        return new Error('Error fetching assets')
    }
}

export async function getAllNfts(address: string, rpc: string): Promise<DigitalAsset[] | Error> {

    try {
        const umi = createUmi(rpc)
            .use(mplTokenMetadata())

        const assets = await fetchAllDigitalAssetByOwner(umi, publicKey(address))
        return assets
    } catch (error) {
        console.error(error)
        return new Error('Error fetching assets')
    }

}

export function isPublickey(address: string) {

    if (address.length > 44 || address.length < 32) {
        return {
            error: true,
            message: "Invalid public key length"
        }
    }
    const isBase58 = address => /^[A-HJ-NP-Za-km-z1-9]*$/.test(address);
    if (!isBase58(address)) {
        return {
            error: true,
            message: "Non base58 characters in public key"
        }
    }
    return {
        error: false,
        message: "Valid public key"
    }
}