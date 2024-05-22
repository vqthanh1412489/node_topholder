"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainbaseM = void 0;
class ChainbaseM {
    constructor({ amount, usdValue, walletAddress, }) {
        this.amount = amount;
        this.usdValue = usdValue;
        this.walletAddress = walletAddress;
    }
    static fromJson(json) {
        return new ChainbaseM({
            amount: parseFloat(json["amount"]),
            usdValue: parseFloat(json["usd_value"]),
            walletAddress: json["wallet_address"],
        });
    }
    toJson() {
        return JSON.stringify({
            amount: this.amount,
            usdValue: this.usdValue,
            walletAddress: this.walletAddress,
        });
    }
}
exports.ChainbaseM = ChainbaseM;
//# sourceMappingURL=chainbase_m.js.map