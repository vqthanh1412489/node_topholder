// export class ChainbaseM {
//     amount?: number;
//     usdValue?: number;
//     walletAddress?: string;

//     constructor({
//         amount,
//         usdValue,
//         walletAddress,
//     }: {
//         amount?: number;
//         usdValue?: number;
//         walletAddress?: string;
//     }) {
//         this.amount = amount;
//         this.usdValue = usdValue;
//         this.walletAddress = walletAddress;
//     }

//     static fromJson(json: any): ChainbaseM {
//         return new ChainbaseM({
//             amount: parseFloat(json["amount"]),
//             usdValue: parseFloat(json["usd_value"]),
//             walletAddress: json["wallet_address"],
//         });
//     }

//     toJson(): string {
//         return JSON.stringify({
//             amount: this.amount,
//             usdValue: this.usdValue,
//             walletAddress: this.walletAddress,
//         });
//     }
// }
export interface ChainbaseM {
    code: number;
    message: string;
    data: DatumChainbaseM[];
    next_page: number;
    count: number;
}

export interface DatumChainbaseM {
    amount: string;
    original_amount: string;
    usd_value: string;
    wallet_address: string;
}