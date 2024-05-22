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
exports.TronNetworkProvider = void 0;
const axios_1 = require("axios");
const models_1 = require("../models");
class TronNetworkProvider {
    constructor() {
        this.baseUrl = 'https://api.trongrid.io/v1/';
        this.apiKey = '5920e0b3-8a75-4dba-a108-de0027bf573c';
    }
    getTopTokenHolders(tokenAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryParameters = {
                    'order_by': 'balance,desc',
                    'limit': '100',
                };
                const endPoint = `contracts/${tokenAddress}/tokens`;
                // console.log(`endPoint: ${endPoint}`);
                const config = {
                    headers: {
                        'TRON-PRO-API-KEY': this.apiKey,
                    },
                    params: queryParameters,
                };
                const response = yield axios_1.default.get(`${this.baseUrl}${endPoint}`, config);
                // console.log('response: ', response.data);
                if (response.status === 200 && response.data && response.data['data']) {
                    const data = response.data['data'].map((e) => models_1.TronNetworkM.fromJson(e));
                    return models_1.AddressWithBalanceM.convertTronNetworkToAddressWithBalance(data);
                }
                throw new Error(`TronNetworkProvider getTopTokenHolders Error: ${response.data}`);
            }
            catch (error) {
                console.log(`TronNetworkProvider getTopTokenHolders Error: ${error}`);
                throw error;
            }
        });
    }
}
exports.TronNetworkProvider = TronNetworkProvider;
//# sourceMappingURL=tron_network_provider.js.map