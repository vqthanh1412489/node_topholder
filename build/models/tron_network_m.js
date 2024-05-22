"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TronNetworkM = void 0;
class TronNetworkM {
    constructor({ address, amount }) {
        this.address = address;
        this.amount = amount;
    }
    static fromJson(json) {
        const key = Object.keys(json)[0];
        const value = json[key];
        return new TronNetworkM({
            address: key,
            amount: value,
        });
    }
    toJson() {
        return JSON.stringify({
            address: this.address,
            amount: this.amount,
        });
    }
}
exports.TronNetworkM = TronNetworkM;
//# sourceMappingURL=tron_network_m.js.map