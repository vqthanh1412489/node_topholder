"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressWithBalanceM = void 0;
const utils_1 = require("../utils");
class AddressWithBalanceM {
    constructor({ amount, address }) {
        this.amount = amount;
        this.address = address;
    }
    static fromJson(json) {
        return new AddressWithBalanceM({
            amount: parseFloat(json['amount']),
            address: json['address'],
        });
    }
    static convertChainbaseToAddressWithBalance(chainBases) {
        const addressWithBalances = [];
        for (const chainBase of chainBases) {
            addressWithBalances.push(new AddressWithBalanceM({
                amount: Math.floor(chainBase.amount),
                address: chainBase.walletAddress,
            }));
        }
        return addressWithBalances;
    }
    // static convertCovalenthqToAddressWithBalance(covalenthqs: CovalenthqM[]): AddressWithBalanceM[] {
    //     const addressWithBalances: AddressWithBalanceM[] = [];
    //     for (const item of covalenthqs) {
    //         addressWithBalances.push(new AddressWithBalanceM({
    //             amount: item.balance!.convertToDecimal(item.contractDecimals!),
    //             address: item.address!,
    //         }));
    //     }
    //     return addressWithBalances;
    // }
    static convertTronNetworkToAddressWithBalance(tronNetworks) {
        const addressWithBalances = [];
        // console.log('convertTronNetworkToAddressWithBalance: ', tronNetworks);
        for (const item of tronNetworks) {
            addressWithBalances.push(new AddressWithBalanceM({
                amount: (0, utils_1.convertToDecimal)(item.amount, 6),
                address: item.address,
            }));
        }
        return addressWithBalances;
    }
    static findDifferenceWithExcelItem(addressWithBalances, arrayExcel) {
        const differenceListResult = [];
        for (const item of addressWithBalances) {
            let found = false;
            for (const excelItem of arrayExcel) {
                const excelAddress = excelItem;
                if (item && item.address && excelAddress) {
                    if (item.address.toLowerCase() === excelAddress.toLowerCase()) {
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                differenceListResult.push(item);
            }
        }
        return differenceListResult;
    }
    static mergeDuplicateAddresses(addressWithBalances) {
        const uniqueAddresses = {};
        for (const item of addressWithBalances) {
            const address = item.address;
            const amount = item.amount;
            if (uniqueAddresses.hasOwnProperty(address)) {
                uniqueAddresses[address].amount += amount;
            }
            else {
                uniqueAddresses[address] = item;
            }
        }
        return Object.values(uniqueAddresses);
    }
}
exports.AddressWithBalanceM = AddressWithBalanceM;
//# sourceMappingURL=address_with_balance_m.js.map