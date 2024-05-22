import {AddressByChainM} from './address_by_chain_m';

export class MyTokenM {
    name: string;
    chains: AddressByChainM[];
    minBalance: number;



    constructor({
        name,
        chains,
        minBalance,


    }: {
        name: string;
        chains: AddressByChainM[];
        minBalance: number;


    }) {
        this.name = name;
        this.chains = chains;
        this.minBalance = minBalance;


    }

    copyWith({
        name,
        chains,
        minBalance,


    }: {
        name?: string;
        chains?: AddressByChainM[];
        minBalance?: number;


    }) {
        return new MyTokenM({
            name: name ?? this.name,
            chains: chains ?? this.chains,
            minBalance: minBalance ?? this.minBalance,


        });
    }

    toJson() {
        return {
            name: this.name,
            chains: this.chains.map((x) => x.toJson()),
            min_balance: this.minBalance,


        };
    }
}
