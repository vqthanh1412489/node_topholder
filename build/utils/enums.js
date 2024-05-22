"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EProvider = exports.mapENetworkToCovalentProvider = exports.mapENetworkToChainbaseProvider = exports.ENetwork = void 0;
var ENetwork;
(function (ENetwork) {
    ENetwork[ENetwork["Ethereum"] = 0] = "Ethereum";
    ENetwork[ENetwork["Polygon"] = 1] = "Polygon";
    ENetwork[ENetwork["BSC"] = 2] = "BSC";
    ENetwork[ENetwork["Avalanche"] = 3] = "Avalanche";
    ENetwork[ENetwork["ArbitrumOne"] = 4] = "ArbitrumOne";
    ENetwork[ENetwork["Optimism"] = 5] = "Optimism";
    ENetwork[ENetwork["Base"] = 6] = "Base";
    ENetwork[ENetwork["Tron"] = 7] = "Tron";
})(ENetwork || (exports.ENetwork = ENetwork = {}));
exports.mapENetworkToChainbaseProvider = {
    [ENetwork.Ethereum]: 1,
    [ENetwork.BSC]: 56,
    [ENetwork.Polygon]: 137,
    [ENetwork.Avalanche]: 43114,
    [ENetwork.ArbitrumOne]: 42161,
    [ENetwork.Optimism]: 10,
    [ENetwork.Base]: 8453,
    [ENetwork.Tron]: 0,
};
exports.mapENetworkToCovalentProvider = {
    [ENetwork.Ethereum]: 'eth-mainnet',
    [ENetwork.BSC]: 'bsc-mainnet',
    [ENetwork.Polygon]: 'matic-mainnet',
    [ENetwork.Avalanche]: 'avalanche-mainnet',
    [ENetwork.ArbitrumOne]: 'arbitrum-mainnet',
    [ENetwork.Optimism]: 'optimism-mainnet',
    [ENetwork.Base]: 'base-mainnet',
    [ENetwork.Tron]: '0',
};
var EProvider;
(function (EProvider) {
    EProvider["Chainbase"] = "Chainbase";
    EProvider["Covalenthq"] = "Covalenthq";
})(EProvider || (exports.EProvider = EProvider = {}));
//# sourceMappingURL=enums.js.map