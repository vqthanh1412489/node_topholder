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

// Converts JSON strings to/from your types
export class Convert {
    public static toMAddressBalanceWithType(json: string): MAddressBalanceWithType {
        return JSON.parse(json);
    }

    public static mAddressBalanceWithTypeToJson(value: MAddressBalanceWithType): string {
        return JSON.stringify(value);
    }
}
