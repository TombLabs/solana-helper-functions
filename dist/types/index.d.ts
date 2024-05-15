export type SolanaEnv = "mainnet" | "devnet" | "testnet" | "localhost";
export type NFT = {
    mint: string;
    owner: string;
    authorities: {
        type: string;
        address: string;
    }[];
    metadata: DasApiMetadata;
    image: string;
    uri: string;
    token_account: string;
    token_standard: "nft" | "cnft" | "pnft" | "nft22";
    collection: string | null;
    collection_metadata: DasApiMetadata | null;
    frozen: boolean;
    delegated: boolean;
    delegate: string | null;
    burnt: boolean;
};
export type TransactionResult = {
    signature?: string;
    error: boolean;
    message: string;
};
export type DasApiAsset = {
    interface: DasApiAssetInterface;
    id: string;
    content: DasApiAssetContent;
    authorities: Array<DasApiAssetAuthority>;
    compression: DasApiAssetCompression;
    grouping: Array<DasApiAssetGrouping>;
    royalty: DasApiAssetRoyalty;
    creators: Array<DasApiAssetCreator>;
    ownership: DasApiAssetOwnership;
    uses?: DasApiUses;
    supply: DasApiAssetSupply;
    mutable: boolean;
    burnt: boolean;
};
export type DasApiAssetList = {
    total: number;
    limit: number;
    items: Array<DasApiAsset>;
    [key: string]: unknown;
};
export type DasApiAssetInterface = 'V1_NFT' | 'V1_PRINT' | 'LEGACY_NFT' | 'V2_NFT' | 'FungibleAsset' | 'Custom' | 'Identity' | 'Executable' | 'ProgrammableNFT';
export type DasApiAssetContent = {
    json_uri: string;
    files?: Array<{
        uri?: string;
        mime?: string;
        [key: string]: unknown;
    }>;
    metadata: DasApiMetadata;
    links?: Array<{
        [key: string]: unknown;
    }>;
};
export type DasApiAssetAuthority = {
    address: string;
    scopes: DasApiAuthorityScope[];
};
export type DasApiAssetCompression = {
    eligible: boolean;
    compressed: boolean;
    data_hash: string;
    creator_hash: string;
    asset_hash: string;
    tree: string;
    seq: number;
    leaf_id: number;
};
export type DasApiAssetOwnership = {
    frozen: boolean;
    delegated: boolean;
    delegate: string | null;
    ownership_model: 'single' | 'token';
    owner: string;
};
export type DasApiAssetSupply = {
    print_max_supply: number;
    print_current_supply: number;
    edition_nonce: number | null;
};
export type DasApiAssetRoyalty = {
    royalty_model: 'creators' | 'fanout' | 'single';
    target: string | null;
    percent: number;
    basis_points: number;
    primary_sale_happened: boolean;
    locked: boolean;
};
export type DasApiAssetCreator = {
    address: string;
    share: number;
    verified: boolean;
};
export type DasApiPropGroupKey = 'collection';
export type DasApiAssetGrouping = {
    group_key: DasApiPropGroupKey;
    group_value: string;
};
export type DasApiAuthorityScope = 'full' | 'royalty' | 'metadata' | 'extension';
export type DasApiMetadata = {
    name: string;
    symbol: string;
    description?: string;
    token_standard?: string;
    attributes?: Array<{
        trait_type?: string;
        value?: string;
        [key: string]: unknown;
    }>;
    [key: string]: unknown;
};
export type DasApiUses = {
    use_method: 'burn' | 'multiple' | 'single';
    remaining: number;
    total: number;
};
export type GetAssetProofRpcResponse = {
    root: string;
    proof: string[];
    node_index: number;
    leaf: string;
    tree_id: string;
};
