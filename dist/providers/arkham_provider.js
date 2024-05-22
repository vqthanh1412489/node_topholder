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
exports.ArrkhamProvider = void 0;
const crypto_js_1 = require("crypto-js");
const axios_1 = require("axios");
function createSha256Hash(inputData) {
    const hash = (0, crypto_js_1.SHA256)(inputData).toString();
    return hash;
}
class ArrkhamProvider {
    static getAddressLabel(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiUrl = `${ArrkhamProvider.apiHost}/intelligence/address/${address}`;
                const xTimestamp = Math.floor(Date.now() / 1000).toString();
                const newDict = apiUrl.replace(ArrkhamProvider.apiHost, '').split('?')[0];
                const dummy = `${newDict}:${xTimestamp}:${ArrkhamProvider.apiKey}`;
                const dummyHash = createSha256Hash(dummy);
                const payloadRaw = `${ArrkhamProvider.apiKey}:${dummyHash}`;
                const xPayloadResult = createSha256Hash(payloadRaw);
                const headers = {
                    'Origin': 'https://platform.arkhamintelligence.com',
                    'Referer': 'https://platform.arkhamintelligence.com/',
                    'X-Payload': xPayloadResult,
                    'X-Timestamp': xTimestamp,
                };
                const response = yield axios_1.default.get(apiUrl, { headers });
                // console.log(`response: ${JSON.stringify(response.data)}`);
                if (response.status === 200) {
                    return response.data;
                }
                else {
                    throw new Error('Failed to load address info');
                }
            }
            catch (e) {
                console.log(`Error: ${e.toString()}`);
                throw new Error('Failed to load address info');
            }
        });
    }
}
exports.ArrkhamProvider = ArrkhamProvider;
ArrkhamProvider.apiKey = 'gh67j345kl6hj5k432';
ArrkhamProvider.apiHost = 'https://api.arkhamintelligence.com';
//# sourceMappingURL=arkham_provider.js.map