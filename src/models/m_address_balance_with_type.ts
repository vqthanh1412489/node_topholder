// To parse this data:
//
//   import { Convert, MAddressBalanceWithType } from "./file";
//
//   const mAddressBalanceWithType = Convert.toMAddressBalanceWithType(json);

export interface MAddressBalanceWithType {
    address: string;
    amount: number;
    type: string;
}