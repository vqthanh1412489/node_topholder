const moment = require('moment-timezone');
import { AddressWithBalanceM, ArkhamAddressInfoM, ChainbaseM, CovalenthqM, TronNetworkM } from "../models";
import { EWalletType } from "./enums";

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
    newArray.push(originalArray[0]); // lable
    newArray.push('=HYPERLINK("https://platform.arkhamintelligence.com/explorer/address/' + address + '", "' + address + '")'); //address
    newArray.push(''); // lable 2
    newArray.push(originalArray[2]);// type
    newArray.push(...Array(dayNotFound).fill('')); // Insert '' for the number of days not found
    newArray.push(originalArray[3]); // amount

    return newArray;
}

export function calculatePercentageDifference(prevousAmount: number, currentAmount: number): number {
    const difference = currentAmount - prevousAmount;
    const percentageDifference = (difference / prevousAmount) * 100;

    return parseFloat(percentageDifference.toFixed(2));
}

export function escapeSpecialCharacters(message: string): string {
    return message.replace(/([_*\[\]()~`>#+-=|{}.!\\])/g, '\\$1');
}

export function findDuplicates(a1, a2) {
    const duplicates = a1.filter(item => a2.includes(item));
    return duplicates;
}

export function getCurrentTimeInBangkok() {
    const date = moment().tz('Asia/Bangkok');
    const dateString = `${date.date()}/${date.month() + 1}/${date.year()} ${date.hours()}:${date.minutes()}:${date.seconds()}`;
    return dateString;
}

export function getMondays(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr); // Ngày bắt đầu
    const endDate = endDateStr ? new Date(endDateStr) : new Date(); // Ngày kết thúc hoặc ngày hiện tại nếu không được cung cấp

    const mondays = [];

    let currentDate = startDate;

    // Lặp qua các ngày từ ngày bắt đầu đến ngày kết thúc
    while (currentDate <= endDate) {
        // Kiểm tra nếu ngày hiện tại là thứ 2
        if (currentDate.getDay() === 1) {
            mondays.push(new Date(currentDate)); // Thêm ngày thứ 2 vào danh sách
        }
        // Tăng ngày hiện tại lên 1 ngày
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Trả về danh sách các ngày thứ 2 với định dạng năm/tháng/ngày
    return mondays.map(date => date.toISOString().split('T')[0]);
}

export function getColumnName(columnIndex) {
    let columnName = '';
    while (columnIndex >= 0) {
        columnName = String.fromCharCode((columnIndex % 26) + 65) + columnName;
        columnIndex = Math.floor(columnIndex / 26) - 1;
    }
    return columnName;
}

export function findDifferenceWithExcelItem(addressWithBalances: AddressWithBalanceM[], arrayExcel: string[]): AddressWithBalanceM[] {
    const result: AddressWithBalanceM[] = [];

    for (const item of addressWithBalances) {
        let found = false;

        for (const excelItem of arrayExcel) {
            const excelAddress = excelItem;
            if (item && item.address && excelAddress) {
                if (item.address.toLowerCase() === excelAddress.toLowerCase()) {
                    found = true;
                    break;
                }
            }

        }

        if (!found) {
            result.push(item);
        }
    }

    return result;
}

export function convertChainbaseToAddressWithBalance(chainBases: ChainbaseM): AddressWithBalanceM[] {
    return chainBases.data.map(chainBase => new AddressWithBalanceM({
        amount: Math.floor(parseInt(chainBase.amount)),
        address: chainBase.wallet_address,
    }));
}

export function convertCovalenthqToAddressWithBalance(covalenthqs: CovalenthqM): AddressWithBalanceM[] {
    return covalenthqs.data.items.map(covalenthq => new AddressWithBalanceM({
        amount: convertToDecimal(covalenthq.balance, covalenthq.contract_decimals),
        address: covalenthq.address,
    }));
}

export function convertTronNetworkToAddressWithBalance(tronNetworks: TronNetworkM[]): AddressWithBalanceM[] {
    const addressWithBalances: AddressWithBalanceM[] = [];

    // console.log('convertTronNetworkToAddressWithBalance: ', tronNetworks);

    for (const item of tronNetworks) {
        addressWithBalances.push(new AddressWithBalanceM({
            amount: convertToDecimal(item.amount!, 6),
            address: item.address!,
        }));
    }

    return addressWithBalances;
}

export function mergeDuplicateAddresses(addressWithBalances: AddressWithBalanceM[]): AddressWithBalanceM[] {
    const uniqueAddresses: { [key: string]: AddressWithBalanceM } = {};

    for (const item of addressWithBalances) {
        const address = item.address;
        const amount = item.amount;

        if (uniqueAddresses.hasOwnProperty(address)) {
            uniqueAddresses[address].amount += amount;
        } else {
            uniqueAddresses[address] = item;
        }
    }

    return Object.values(uniqueAddresses);
}

export function classifyStringToTag(name) {
    if (!name || name.trim() === '') {
        return EWalletType.child;
    }

    const lowerName = name.toLowerCase().trim();
    if (lowerName.trim() === 'opensea user') {
        return EWalletType.child;
    }

    if (lowerName.includes(' cold') || lowerName.trim() === 'gnosis safe proxy') {
        return EWalletType.cold;
    }

    if (lowerName.includes('hot wallet') || lowerName.includes(' deposit')) {
        return EWalletType.hot;
    }

    if (lowerName.includes('gnosis safe proxy')) {
        return EWalletType.lock;
    }

    if (lowerName.endsWith('.eth') || lowerName.includes('opensea user')) {
        return EWalletType.mm;
    }

    return 'unknown';
}