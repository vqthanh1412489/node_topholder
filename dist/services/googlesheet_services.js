"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GooglesheetServices = void 0;
const utils_1 = require("../utils");
const services_1 = require("../services");
const providers_1 = require("../providers");
class GooglesheetServices {
    static getListAddressBySheetName(sheetName) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield services_1.GooglesheetBaseServices.getSheetsInstance().spreadsheets.values.get({
                spreadsheetId: utils_1.googleSheetSpreadsheetId,
                range: `${sheetName}!B2:B`,
            });
            const rows = response.data.values.map(row => row[0]);
            return rows;
        });
    }
    static getAndFilterAddressesBySheetName(sheetName) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield services_1.GooglesheetBaseServices.getSheetsInstance().spreadsheets.values.get({
                spreadsheetId: utils_1.googleSheetSpreadsheetId,
                range: `${sheetName}!B2:B`,
            });
            const row = response.data.values.map(row => row[0]);
            const result = (0, utils_1.removeDuplicatesItemInList)(row);
            return result;
        });
    }
    static getAddressesMoreBalance(sheetName) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield services_1.GooglesheetBaseServices.getDatasBySheetName(sheetName);
            const result = [];
            for (let i = 1; i < response.length; i++) {
                const item = response[i];
                result.push({
                    address: item[1],
                    prevousAmount: parseFloat(item[item.length - 2]),
                    currentAmount: parseFloat(item[item.length - 1]),
                    isTracking: item[3] === '1',
                });
            }
            // console.log('getAddressesMoreBalance result', result);
            return result.map((e) => {
                if (isNaN(e.prevousAmount)) {
                    e.prevousAmount = 0;
                }
                if (isNaN(e.currentAmount)) {
                    e.currentAmount = 0;
                }
                return e;
            });
        });
    }
    static removeDataBeforePush(sheetName) {
        return __awaiter(this, void 0, void 0, function* () {
            const maxColumnBySheetName = yield services_1.GooglesheetBaseServices.getMaxColumnBySheetName(sheetName);
            // console.log('maxColumnBySheetName ', maxColumnBySheetName)
            if (maxColumnBySheetName < utils_1.COLUMN_BEGIN_DATA + 3) {
                return;
            }
            const sheetId = yield services_1.GooglesheetBaseServices.getSheetIdBySheetName(sheetName);
            services_1.GooglesheetBaseServices.getSheetsInstance().spreadsheets.batchUpdate({
                spreadsheetId: utils_1.googleSheetSpreadsheetId,
                resource: {
                    requests: [
                        {
                            deleteDimension: {
                                range: {
                                    sheetId,
                                    dimension: 'COLUMNS',
                                    startIndex: utils_1.COLUMN_BEGIN_DATA - 1,
                                    endIndex: utils_1.COLUMN_BEGIN_DATA,
                                }
                            }
                        }
                    ]
                }
            }, (err, result) => {
                if (err) {
                    console.log('The API returned an error: ' + err);
                }
                else {
                    console.log(`${result} cells appended.`);
                }
            });
        });
    }
    static updateAddressInfo(sheetName, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = {
                values,
            };
            services_1.GooglesheetBaseServices.getSheetsInstance().spreadsheets.values.update({
                spreadsheetId: utils_1.googleSheetSpreadsheetId,
                range: `${sheetName}!C1`,
                valueInputOption: 'USER_ENTERED',
                resource,
            }, (err, result) => {
                if (err) {
                    console.log('The API returned an error: ' + err);
                }
                else {
                    console.log(`${result} cells appended.`);
                }
            });
        });
    }
    static addBalanceViaDay(sheetName_1, values_1) {
        return __awaiter(this, arguments, void 0, function* (sheetName, values, differenceList = []) {
            const response = yield services_1.GooglesheetBaseServices.getSheetsInstance().spreadsheets.values.get({
                spreadsheetId: utils_1.googleSheetSpreadsheetId,
                range: `${sheetName}!1:1`, // Lấy dữ liệu từ hàng đầu tiên
            });
            const lastColumn = response.data.values[0].length;
            // console.log(`lastColumn ${lastColumn}`)
            const range = `${sheetName}!${String.fromCharCode(65 + lastColumn)}1`;
            const resource = {
                values,
            };
            yield services_1.GooglesheetBaseServices.getSheetsInstance().spreadsheets.values.update({
                spreadsheetId: utils_1.googleSheetSpreadsheetId,
                range,
                valueInputOption: 'USER_ENTERED',
                resource,
            }, (err, result) => {
                if (err) {
                    console.log('The API returned an error: ' + err);
                }
                else {
                    console.log(`${result} cells appended.`);
                }
            });
            if (differenceList.length > 0) {
                const result = [];
                for (const e of differenceList) {
                    const arkhamAddressInfoM = yield providers_1.ArrkhamProvider.getAddressLabel(e.address);
                    const entityName = (0, utils_1.getCommonName)(arkhamAddressInfoM);
                    // console.log('e.address,', e.address);
                    result.push((0, utils_1.insertZeroAfterAddress)([
                        entityName,
                        e.address,
                        e.amount,
                    ], lastColumn - 2, e.address));
                }
                const resource = {
                    values: result,
                };
                yield services_1.GooglesheetBaseServices.getSheetsInstance().spreadsheets.values.append({
                    spreadsheetId: utils_1.googleSheetSpreadsheetId,
                    range: `${sheetName}!A1`,
                    valueInputOption: 'USER_ENTERED',
                    resource,
                }, (err, result) => {
                    if (err) {
                        console.log('The API returned an error: ' + err);
                    }
                    else {
                        console.log(`${result.data.updates.updatedCells} cells appended.`);
                    }
                });
            }
            yield this.removeDataBeforePush(sheetName);
        });
    }
}
exports.GooglesheetServices = GooglesheetServices;
//# sourceMappingURL=googlesheet_services.js.map