import { EWalletType } from "../utils";

export class AddressMoreBalanceM {
    address: string;
    prevousAmount: number;
    currentAmount: number;
    type: EWalletType;

    constructor({ address, prevousAmount, currentAmount, type }: { address: string; prevousAmount: number; currentAmount: number; type?: EWalletType }) {
        this.address = address;
        this.prevousAmount = prevousAmount;
        this.currentAmount = currentAmount;
        this.type = type;
    }

    // static fromJson(json: any): AddressMoreBalanceM {
    //     return new AddressMoreBalanceM({
    //         address: json['address'],
    //         prevousAmount: parseFloat(json['prevousAmount']),
    //         currentAmount: parseFloat(json['currentAmount']),
    //         type: json['isTracking'],
    //     });
    // }
}
