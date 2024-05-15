
export type SolanaEnv = "mainnet" | "devnet" | "testnet" | "localhost"

// ---------------------------------------- //
// CUSTOM TYPES                             //
// ---------------------------------------- //

/**
 * NFT Information
 */
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
}

export type TransactionResult = {
    signature?: string;
    error: boolean;
    message: string;
}


// ---------------------------------------- //
// Result types.                            //
// ---------------------------------------- //

/**
 * Representation of an asset.
 */
export type DasApiAsset = {
    /**
     * The asset interface.
     */
    interface: DasApiAssetInterface;

    /**
     * The asset Id.
     */
    id: string;

    /**
     * The asset content.
     */
    content: DasApiAssetContent;

    /**
     * List of authorities.
     */
    authorities: Array<DasApiAssetAuthority>;

    /**
     * Compression information.
     */
    compression: DasApiAssetCompression;

    /**
     * Grouping information.
     */
    grouping: Array<DasApiAssetGrouping>;

    /**
     * Royalty information.
     */
    royalty: DasApiAssetRoyalty;

    /**
     * List of creators.
     */
    creators: Array<DasApiAssetCreator>;

    /**
     * Ownership information.
     */
    ownership: DasApiAssetOwnership;

    /**
     * Uses information.
     */
    uses?: DasApiUses;

    /**
     * Supply information.
     */
    supply: DasApiAssetSupply;

    /**
     * Indicates whether the asset's metadata is mutable or not.
     */
    mutable: boolean;

    /**
     * Indicates whether the asset is burnt or not.
     */
    burnt: boolean;
};

/**
 * Representation of a list of assets.
 */
export type DasApiAssetList = {
    /**
     * total number of assets in the list.
     */
    total: number;

    /**
     * Limit of assets used to create the list. When the `total` value is
     * lower than the `limit`, it means that there are no more assets to be
     * retrieved.
     */
    limit: number;

    /**
     * Listing of individual assets.
     */
    items: Array<DasApiAsset>;

    /**
     * Additional information about the list.
     */
    [key: string]: unknown;
};


/**
 * Sorting criteria.
 */
type DasApiParamAssetSortBy = {
    sortBy: 'created' | 'updated' | 'recent_action' | 'none';
    sortDirection: 'asc' | 'desc';
};

export type DasApiAssetInterface =
    | 'V1_NFT'
    | 'V1_PRINT'
    | 'LEGACY_NFT'
    | 'V2_NFT'
    | 'FungibleAsset'
    | 'Custom'
    | 'Identity'
    | 'Executable'
    | 'ProgrammableNFT';

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

export type DasApiAuthorityScope =
    | 'full'
    | 'royalty'
    | 'metadata'
    | 'extension';

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