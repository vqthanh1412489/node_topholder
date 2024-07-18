export enum ENetwork {
    Ethereum,
    Polygon,
    BSC,
    Avalanche,
    ArbitrumOne,
    Optimism,
    Base,
    Tron,
}

export const mapENetworkToChainbaseProvider: { [key in ENetwork]: any } = {
    [ENetwork.Ethereum]: 1,
    [ENetwork.BSC]: 56,
    [ENetwork.Polygon]: 137,
    [ENetwork.Avalanche]: 43114,
    [ENetwork.ArbitrumOne]: 42161,
    [ENetwork.Optimism]: 10,
    [ENetwork.Base]: 8453,
    [ENetwork.Tron]: 0,
};

export const mapENetworkToCovalentProvider: { [key in ENetwork]: any } = {
    [ENetwork.Ethereum]: 'eth-mainnet',
    [ENetwork.BSC]: 'bsc-mainnet',
    [ENetwork.Polygon]: 'matic-mainnet',
    [ENetwork.Avalanche]: 'avalanche-mainnet',
    [ENetwork.ArbitrumOne]: 'arbitrum-mainnet',
    [ENetwork.Optimism]: 'optimism-mainnet',
    [ENetwork.Base]: 'base-mainnet',
    [ENetwork.Tron]: '0',
};

export enum EProvider {
    Chainbase = 'Chainbase',
    Covalenthq = 'Covalenthq',
}

export enum EWalletType {
    cold = 'cold',
    hot = 'hot',
    mm = 'mm',
    child = 'child',
    lock = 'lock',
    stack = 'stack',
    dev = 'dev',
    unknown = 'unknown',
}

export enum EAppMode {
    DAILY = 'DAILY',
    HISTORY = 'HISTORY',
    ANALYSIS_HISTORY = 'ANALYSIS_HISTORY',
    TEST = 'TEST',
}