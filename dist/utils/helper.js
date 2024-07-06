"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDuplicates = exports.escapeSpecialCharacters = exports.calculatePercentageDifference = exports.insertZeroAfterAddress = exports.getRandomItem = exports.removeDuplicates = exports.removeEmptyItemInList = exports.removeDuplicatesItemInList = exports.convertToDecimal = exports.getCommonName = exports.getType = exports.getArkhamLabel = exports.getEntityName = exports.getChain = void 0;
function getChain(instance) {
    return instance.chain || '';
}
exports.getChain = getChain;
function getEntityName(instance) {
    if (instance.arkhamEntity) {
        return instance.arkhamEntity.name || '';
    }
    else if (instance.predictedEntity) {
        return instance.predictedEntity.name || '';
    }
    else {
        return '';
    }
}
exports.getEntityName = getEntityName;
function getArkhamLabel(instance) {
    var _a;
    return ((_a = instance.arkhamLabel) === null || _a === void 0 ? void 0 : _a.name) || '';
}
exports.getArkhamLabel = getArkhamLabel;
function getType(instance) {
    var _a, _b, _c;
    let result = [];
    if (instance.arkhamEntity) {
        if (instance.arkhamEntity.type) {
            result.push(instance.arkhamEntity.type);
        }
        else {
            if (((_a = instance.arkhamEntity.populatedTags) === null || _a === void 0 ? void 0 : _a.length) > 0) {
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
        }
        else {
            if (((_b = instance.predictedEntity.populatedTags) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                for (const item of instance.predictedEntity.populatedTags) {
                    if (item.id) {
                        result.push(item.id);
                    }
                }
            }
        }
    }
    if (((_c = instance.populatedTags) === null || _c === void 0 ? void 0 : _c.length) > 0) {
        for (const item of instance.populatedTags) {
            if (item.id) {
                result.push(item.id);
            }
        }
    }
    return removeDuplicatesItemInList(result).join(', ');
}
exports.getType = getType;
function getCommonName(instance) {
    if (getEntityName(instance) === '' && getArkhamLabel(instance) === '') {
        return getType(instance).trim();
    }
    else {
        return `${getEntityName(instance)} ${getArkhamLabel(instance)}`.trim();
    }
}
exports.getCommonName = getCommonName;
function convertToDecimal(input, contractDecimals) {
    const largeInteger = BigInt(input);
    const decimals = contractDecimals;
    const decimalNumber = Number(largeInteger) / Number(BigInt(10) ** BigInt(decimals));
    return Math.floor(decimalNumber);
}
exports.convertToDecimal = convertToDecimal;
function removeDuplicatesItemInList(inputList) {
    const uniqueList = Array.from(new Set(inputList));
    return uniqueList;
}
exports.removeDuplicatesItemInList = removeDuplicatesItemInList;
function removeEmptyItemInList(inputList) {
    const nonEmptyList = inputList.filter((element) => element !== "");
    return nonEmptyList;
}
exports.removeEmptyItemInList = removeEmptyItemInList;
function removeDuplicates(arr) {
    return arr.filter((value, index, self) => self.indexOf(value) === index);
}
exports.removeDuplicates = removeDuplicates;
function getRandomItem(items) {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}
exports.getRandomItem = getRandomItem;
function insertZeroAfterAddress(originalArray, dayNotFound, address) {
    // Find the index of the address element in the original array
    const index = originalArray.indexOf(address);
    // If the address element is not found in the array or dayNotFound is less than or equal to 0, return the original array
    if (index === -1 || dayNotFound <= 0) {
        return originalArray;
    }
    // Create a new array by copying elements before and after the address, and inserting "0" in between
    const newArray = [];
    newArray.push(originalArray[0]);
    newArray.push('=HYPERLINK("https://platform.arkhamintelligence.com/explorer/address/' + address + '", "' + address + '")');
    // newArray.push(address);
    newArray.push(...Array(dayNotFound).fill(''));
    newArray.push(originalArray[originalArray.length - 1]);
    return newArray;
}
exports.insertZeroAfterAddress = insertZeroAfterAddress;
function calculatePercentageDifference(prevousAmount, currentAmount) {
    const difference = currentAmount - prevousAmount;
    const percentageDifference = (difference / prevousAmount) * 100;
    return percentageDifference;
}
exports.calculatePercentageDifference = calculatePercentageDifference;
function escapeSpecialCharacters(message) {
    return message.replace(/([_*\[\]()~`>#+-=|{}.!\\])/g, '\\$1');
}
exports.escapeSpecialCharacters = escapeSpecialCharacters;
function findDuplicates(a1, a2) {
    const duplicates = a1.filter(item => a2.includes(item));
    return duplicates;
}
exports.findDuplicates = findDuplicates;
//# sourceMappingURL=helper.js.map