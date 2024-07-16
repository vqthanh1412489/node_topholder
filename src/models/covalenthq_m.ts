// export class CovalenthqM {
//     balance?: string;
//     address?: string;
//     contractDecimals?: number;

//     constructor({
//         balance: balance,
//         address: address,
//         contractDecimals: contractDecimals,
//     }: {
//         balance?: string;
//         address?: string;
//         contractDecimals?: number;
//     }) {
//         this.balance = balance;
//         this.address = address;
//         this.contractDecimals = contractDecimals;
//     }

//     static fromJson(json: any): CovalenthqM {
//         return new CovalenthqM({
//             balance: json["balance"],
//             address: json["address"],
//             contractDecimals: json["contract_decimals"],
//         });
//     }

//     toJson(): string {
//         return JSON.stringify({
//             balance: this.balance,
//             address: this.address,
//             contractDecimals: this.contractDecimals,
//         });
//     }
// }
export interface CovalenthqM {
    data: Data;
    error: boolean;
    error_message: null;
    error_code: null;
}

export interface Data {
    updated_at: Date;
    chain_id: number;
    chain_name: string;
    items: Item[];
    pagination: Pagination;
}

export interface Item {
    contract_decimals: number;
    contract_name: string;
    contract_ticker_symbol: string;
    logo_url: string;
    address: string;
    balance: string;
    total_supply: string;
    block_height: number;
}

export interface Pagination {
    has_more: boolean;
    page_number: number;
    page_size: number;
    total_count: number;
}