"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainbaseProvider = void 0;
const axios_1 = require("axios");
const chainbase_m_1 = require("../models/chainbase_m");
const address_with_balance_m_1 = require("../models/address_with_balance_m");
const utils_1 = require("../utils");
class ChainbaseProvider {
    constructor() {
        this.baseUrl = 'https://api.chainbase.online/v1';
        this.apiKeys = ['2e1SXeXTKCmUPGWTmL0bMA0WEeQ', // vqthanh1412489
            '2gDyr9wqRbNiT7JZjTriq4vrJKx', // vqthanh1
            '2gDzHFwCGzOqzGivTLYto0uEAKR', // vqthanh2
            '2gE09iWSfjeKzAOyQWPs1cnDokA', // vqthanh10
        ];
    }
    getTopTokenHolders(chainId, contractAddress, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.baseUrl}/token/top-holders?chain_id=${chainId}&contract_address=${contractAddress}&page=${page}&limit=100`, {
                    headers: {
                        'x-api-key': (0, utils_1.getRandomItem)(this.apiKeys),
                    },
                });
                console.log('apikey', (0, utils_1.getRandomItem)(this.apiKeys));
                if (response.status === 200) {
                    const data = response.data['data'];
                    const tempList = data.map((e) => chainbase_m_1.ChainbaseM.fromJson(e));
                    return address_with_balance_m_1.AddressWithBalanceM.convertChainbaseToAddressWithBalance(tempList);
                }
                throw new Error(`ChainbaseM token/top-holders Error: ${response.data}`);
            }
            catch (e) {
                console.error(`ChainbaseM token/top-holders Error: ${e}`);
                throw new Error(`ChainbaseM token/top-holders Error: ${e}`);
            }
        });
    }
}
exports.ChainbaseProvider = ChainbaseProvider;
//# sourceMappingURL=chainbase_provider.js.map