import { convertToDecimal } from '../utils';
import { ChainbaseM, CovalenthqM, TronNetworkM } from '../models';

export class AddressWithBalanceM {
    amount: number;
    address: string;

    constructor({ amount, address }: { amount: number; address: string }) {
        this.amount = amount;
        this.address = address;
    }
}
