import { ArkhamAddressInfoM } from "../models";

export function getChain(instance: ArkhamAddressInfoM): string {
    return instance.chain || '';
}

export function getEntityName(instance: ArkhamAddressInfoM): string {
    if (instance.arkhamEntity) {
        return instance.arkhamEntity.name || '';
    } else if (instance.predictedEntity) {
        return instance.predictedEntity.name || '';
    } else {
        return '';
    }
}

export function getArkhamLabel(instance: ArkhamAddressInfoM): string {
    return instance.arkhamLabel?.name || '';
}

export function getType(instance: ArkhamAddressInfoM): string {
    let result: string[] = [];

    if (instance.arkhamEntity) {
        if (instance.arkhamEntity.type) {
            result.push(instance.arkhamEntity.type);
        } else {
            if (instance.arkhamEntity.populatedTags?.length > 0) {
                for (const item of instance.arkhamEntity.populatedTags) {
                    if (item.id) {
                        result.push(item.id);
                    }
                }
            }
        }
    }

    if (instance.predictedEntity) {
        if (instance.predictedEntity.type) {
            result.push(instance.predictedEntity.type);
        } else {
            if (instance.predictedEntity.populatedTags?.length > 0) {
                for (const item of instance.predictedEntity.populatedTags) {
                    if (item.id) {
                        result.push(item.id);
                    }
                }
            }
        }
    }

    if (instance.populatedTags?.length > 0) {
        for (const item of instance.populatedTags) {
            if (item.id) {
                result.push(item.id);
            }
        }
    }

    return removeDuplicatesItemInList(result).join(', ');
}

export function getCommonName(instance: ArkhamAddressInfoM): string {
    if (getEntityName(instance) === '' && getArkhamLabel(instance) === '') {
        return getType(instance).trim();
    } else {
        return `${getEntityName(instance)} ${getArkhamLabel(instance)}`.trim();
    }
}

export function convertToDecimal(input: string, contractDecimals: number): number {
    const largeInteger: BigInt = BigInt(input);
    const decimals: number = contractDecimals;
    const decimalNumber: number = Number(largeInteger) / Number(BigInt(10) ** BigInt(decimals));
    return Math.floor(decimalNumber);
}

export function removeDuplicatesItemInList(inputList: string[]): string[] {
    const uniqueList = Array.from(new Set(inputList));
    return uniqueList;
}

export function removeEmptyItemInList(inputList: string[]): string[] {
    const nonEmptyList = inputList.filter((element) => element !== "");
    return nonEmptyList;
}

export function removeDuplicates(arr) {
    return arr.filter((value, index, self) => self.indexOf(value) === index);
}

export function getRandomItem(items: string[]): string {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}

export function insertZeroAfterAddress(
    originalArray: any[],
    dayNotFound: number,
    address: string,
): any[] {
    // Find the index of the address element in the original array
    const index: number = originalArray.indexOf(address);

    // If the address element is not found in the array or dayNotFound is less than or equal to 0, return the original array
    if (index === -1 || dayNotFound <= 0) {
        return originalArray;
    }

    // Create a new array by copying elements before and after the address, and inserting "0" in between
    const newArray: any[] = [];
    newArray.push(originalArray[0]);
    newArray.push('=HYPERLINK("https://platform.arkhamintelligence.com/explorer/address/' + address + '", "' + address + '")');
    // newArray.push(address);
    newArray.push(...Array(dayNotFound).fill(''));
    newArray.push(originalArray[originalArray.length - 1]);

    return newArray;
}

export function calculatePercentageDifference(prevousAmount: number, currentAmount: number): number {
    const difference = currentAmount - prevousAmount;
    const percentageDifference = (difference / prevousAmount) * 100;

    return percentageDifference;
}

export function escapeSpecialCharacters(message: string): string {
    return message.replace(/([_*\[\]()~`>#+-=|{}.!\\])/g, '\\$1');
}

export function findDuplicates(a1, a2) {
    const duplicates = a1.filter(item => a2.includes(item));
    return duplicates;
}