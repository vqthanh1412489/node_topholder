import { convertToDecimal } from '../utils';
import { ChainbaseM, TronNetworkM } from '../models';

export class AddressMoreBalanceM {
    address: string;
    prevousAmount: number;
    currentAmount: number;
    isTracking: boolean = false;

    constructor({ address, prevousAmount, currentAmount, isTracking }: { address: string; prevousAmount: number; currentAmount: number; isTracking?: boolean }) {
        this.address = address;
        this.prevousAmount = prevousAmount;
        this.currentAmount = currentAmount;
        this.isTracking = isTracking || false;
    }

    static fromJson(json: any): AddressMoreBalanceM {
        return new AddressMoreBalanceM({
            address: json['address'],
            prevousAmount: parseFloat(json['prevousAmount']),
            currentAmount: parseFloat(json['currentAmount']),
            isTracking: json['isTracking'],
        });
    }
}
