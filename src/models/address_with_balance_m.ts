import { convertToDecimal } from '../utils';
import { ChainbaseM, CovalenthqM, TronNetworkM } from '../models';

export class AddressWithBalanceM {
    amount: number;
    address: string;

    constructor({ amount, address }: { amount: number; address: string }) {
        this.amount = amount;
        this.address = address;
    }

    static fromJson(json: any): AddressWithBalanceM {
        return new AddressWithBalanceM({
            amount: parseFloat(json['amount']),
            address: json['address'],
        });
    }

    static convertChainbaseToAddressWithBalance(chainBases: ChainbaseM[]): AddressWithBalanceM[] {
        const addressWithBalances: AddressWithBalanceM[] = [];

        for (const chainBase of chainBases) {
            addressWithBalances.push(new AddressWithBalanceM({
                amount: Math.floor(chainBase.amount!),
                address: chainBase.walletAddress!,
            }));
        }

        return addressWithBalances;
    }

    static convertCovalenthqToAddressWithBalance(covalenthqs: CovalenthqM[]): AddressWithBalanceM[] {
        const addressWithBalances: AddressWithBalanceM[] = [];

        for (const item of covalenthqs) {
            addressWithBalances.push(new AddressWithBalanceM({
                amount: convertToDecimal(item.balance!, item.contractDecimals!),
                address: item.address!,
            }));
        }

        return addressWithBalances;
    }

    static convertTronNetworkToAddressWithBalance(tronNetworks: TronNetworkM[]): AddressWithBalanceM[] {
        const addressWithBalances: AddressWithBalanceM[] = [];

        // console.log('convertTronNetworkToAddressWithBalance: ', tronNetworks);

        for (const item of tronNetworks) {
            addressWithBalances.push(new AddressWithBalanceM({
                amount: convertToDecimal(item.amount!, 6),
                address: item.address!,
            }));
        }

        return addressWithBalances;
    }

    // static findDifferenceWithExcelItem(addressWithBalances: AddressWithBalanceM[], arrayExcel: string[]): AddressWithBalanceM[] {
    //     const differenceListResult: AddressWithBalanceM[] = [];

    //     for (const item of addressWithBalances) {
    //         let found = false;

    //         for (const excelItem of arrayExcel) {
    //             const excelAddress = excelItem;
    //             if (item && item.address && excelAddress) {
    //                 if (item.address.toLowerCase() === excelAddress.toLowerCase()) {
    //                     found = true;
    //                     break;
    //                 }
    //             }

    //         }

    //         if (!found) {
    //             differenceListResult.push(item);
    //         }
    //     }

    //     return differenceListResult;
    // }

    static mergeDuplicateAddresses(addressWithBalances: AddressWithBalanceM[]): AddressWithBalanceM[] {
        const uniqueAddresses: { [key: string]: AddressWithBalanceM } = {};

        for (const item of addressWithBalances) {
            const address = item.address;
            const amount = item.amount;

            if (uniqueAddresses.hasOwnProperty(address)) {
                uniqueAddresses[address].amount += amount;
            } else {
                uniqueAddresses[address] = item;
            }
        }

        return Object.values(uniqueAddresses);
    }
}
