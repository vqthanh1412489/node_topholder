"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressMoreBalanceM = void 0;
class AddressMoreBalanceM {
    constructor({ address, prevousAmount, currentAmount, isTracking }) {
        this.isTracking = false;
        this.address = address;
        this.prevousAmount = prevousAmount;
        this.currentAmount = currentAmount;
        this.isTracking = isTracking || false;
    }
    static fromJson(json) {
        return new AddressMoreBalanceM({
            address: json['address'],
            prevousAmount: parseFloat(json['prevousAmount']),
            currentAmount: parseFloat(json['currentAmount']),
            isTracking: json['isTracking'],
        });
    }
}
exports.AddressMoreBalanceM = AddressMoreBalanceM;
//# sourceMappingURL=address_more_balance_m.js.map