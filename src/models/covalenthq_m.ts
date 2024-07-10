export class CovalenthqM {
    balance?: string;
    address?: string;
    contractDecimals?: number;

    constructor({
        balance: balance,
        address: address,
        contractDecimals: contractDecimals,
    }: {
        balance?: string;
        address?: string;
        contractDecimals?: number;
    }) {
        this.balance = balance;
        this.address = address;
        this.contractDecimals = contractDecimals;
    }

    static fromJson(json: any): CovalenthqM {
        return new CovalenthqM({
            balance: json["balance"],
            address: json["address"],
            contractDecimals: json["contract_decimals"],
        });
    }

    toJson(): string {
        return JSON.stringify({
            balance: this.balance,
            address: this.address,
            contractDecimals: this.contractDecimals,
        });
    }
}
