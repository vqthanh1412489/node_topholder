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
exports.GooglesheetBaseServices = void 0;
const { google } = require('googleapis');
const utils_1 = require("../utils");
const client = new google.auth.JWT(utils_1.googleSheetCredentials.client_email, null, utils_1.googleSheetCredentials.private_key, ['https://www.googleapis.com/auth/spreadsheets']);
class GooglesheetBaseServices {
    static getSheetsInstance() {
        return google.sheets({ version: 'v4', auth: client });
    }
    static getSheetIdBySheetName(sheetName) {
        return __awaiter(this, void 0, void 0, function* () {
            const sheets = google.sheets({ version: 'v4', auth: client });
            const response = yield sheets.spreadsheets.get({
                spreadsheetId: utils_1.googleSheetSpreadsheetId,
            });
            const sheet = response.data.sheets.find(sheet => sheet.properties.title === sheetName);
            return sheet.properties.sheetId;
        });
    }
    static getDatasBySheetName(sheetName) {
        return __awaiter(this, void 0, void 0, function* () {
            const sheets = google.sheets({ version: 'v4', auth: client });
            const response = yield sheets.spreadsheets.values.get({
                spreadsheetId: utils_1.googleSheetSpreadsheetId,
                range: sheetName,
            });
            return response.data.values;
        });
    }
    static getMaxColumnBySheetName(sheetName) {
        return __awaiter(this, void 0, void 0, function* () {
            const sheets = google.sheets({ version: 'v4', auth: client });
            const response = yield sheets.spreadsheets.values.get({
                spreadsheetId: utils_1.googleSheetSpreadsheetId,
                range: `${sheetName}!1:1`,
            });
            return response.data.values[0].length;
        });
    }
    // static async deleteColumnBySheetName(sheetName: string, column: number): Promise<void> {
    //     const sheets = google.sheets({ version: 'v4', auth: client });
    //     const sheetId = await this.getSheetIdBySheetName(sheetName);
    //     console.log('sheetId', sheetId);
    //     sheets.spreadsheets.batchUpdate({
    //         spreadsheetId: googleSheetSpreadsheetId,
    //         resource: {
    //             requests: [
    //                 {
    //                     deleteDimension: {
    //                         range: {
    //                             sheetId,
    //                             dimension: 'COLUMNS',
    //                             startIndex: column,
    //                             endIndex: column + 1
    //                         }
    //                     }
    //                 }
    //             ]
    //         }
    //     }, (err, result) => {
    //         if (err) {
    //             console.log('The API returned an error: ' + err);
    //         } else {
    //             console.log(`${result} cells appended.`);
    //         }
    //     });
    // }
    static deleteAllHidenSheet() {
        return __awaiter(this, void 0, void 0, function* () {
            const sheets = google.sheets({ version: 'v4', auth: client });
            const response = yield sheets.spreadsheets.get({
                spreadsheetId: utils_1.googleSheetSpreadsheetId,
            });
            const sheetsList = response.data.sheets;
            for (const sheet of sheetsList) {
                if (sheet.properties.hidden) {
                    const sheetId = sheet.properties.sheetId;
                    sheets.spreadsheets.batchUpdate({
                        spreadsheetId: utils_1.googleSheetSpreadsheetId,
                        resource: {
                            requests: [
                                {
                                    deleteSheet: {
                                        sheetId,
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
                }
            }
        });
    }
    static insertColumnBySheetNameToEnd(sheetName) {
        return __awaiter(this, void 0, void 0, function* () {
            const sheets = google.sheets({ version: 'v4', auth: client });
            const sheetId = yield this.getSheetIdBySheetName(sheetName);
            const maxColumn = yield this.getMaxColumnBySheetName(sheetName);
            sheets.spreadsheets.batchUpdate({
                spreadsheetId: utils_1.googleSheetSpreadsheetId,
                resource: {
                    requests: [
                        {
                            insertDimension: {
                                range: {
                                    sheetId,
                                    dimension: 'COLUMNS',
                                    startIndex: maxColumn,
                                    endIndex: maxColumn + 1
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
}
exports.GooglesheetBaseServices = GooglesheetBaseServices;
//# sourceMappingURL=googlesheet_base_services.js.map