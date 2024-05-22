export class ChainbaseM {
    amount?: number;
    usdValue?: number;
    walletAddress?: string;

    constructor({
        amount,
        usdValue,
        walletAddress,
    }: {
        amount?: number;
        usdValue?: number;
        walletAddress?: string;
    }) {
        this.amount = amount;
        this.usdValue = usdValue;
        this.walletAddress = walletAddress;
    }

    static fromJson(json: any): ChainbaseM {
        return new ChainbaseM({
            amount: parseFloat(json["amount"]),
            usdValue: parseFloat(json["usd_value"]),
            walletAddress: json["wallet_address"],
        });
    }

    toJson(): string {
        return JSON.stringify({
            amount: this.amount,
            usdValue: this.usdValue,
            walletAddress: this.walletAddress,
        });
    }
}
