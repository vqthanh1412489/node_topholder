export class TronNetworkM {
    address?: string;
    amount?: string;

    constructor({ address, amount }: { address?: string; amount?: string }) {
        this.address = address;
        this.amount = amount;
    }

    static fromJson(json: any): TronNetworkM {
        const key = Object.keys(json)[0];
        const value = json[key];

        return new TronNetworkM({
            address: key,
            amount: value,
        });
    }

    toJson(): string {
        return JSON.stringify({
            address: this.address,
            amount: this.amount,
        });
    }
}
