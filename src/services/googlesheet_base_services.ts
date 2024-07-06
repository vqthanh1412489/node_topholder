const { google } = require('googleapis');
import { googleSheetCredentials, googleSheetSpreadsheetId } from '../utils';


const client = new google.auth.JWT(
    googleSheetCredentials.client_email,
    null,
    googleSheetCredentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

class GooglesheetBaseServices {
    static getSheetsInstance() {
        return google.sheets({ version: 'v4', auth: client });
    }

    static async getSheetIdBySheetName(sheetName: string): Promise<string[]> {
        const sheets = google.sheets({ version: 'v4', auth: client });
        const response = await sheets.spreadsheets.get({
            spreadsheetId: googleSheetSpreadsheetId,
        });

        const sheet = response.data.sheets.find(sheet => sheet.properties.title === sheetName);
        return sheet.properties.sheetId
    }

    static async getDatasBySheetName(sheetName: string): Promise<string[][]> {
        const sheets = google.sheets({ version: 'v4', auth: client });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: googleSheetSpreadsheetId,
            range: sheetName,
        });

        return response.data.values;
    }

    static async getMaxColumnBySheetName(sheetName: string): Promise<number> {
        const sheets = google.sheets({ version: 'v4', auth: client });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: googleSheetSpreadsheetId,
            range: `${sheetName}!1:1`,
        });

        return response.data.values[0].length;
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

    static async deleteAllHidenSheet(): Promise<void> {
        const sheets = google.sheets({ version: 'v4', auth: client });
        const response = await sheets.spreadsheets.get({
            spreadsheetId: googleSheetSpreadsheetId,
        });

        const sheetsList = response.data.sheets;
        for (const sheet of sheetsList) {
            if (sheet.properties.hidden) {
                const sheetId = sheet.properties.sheetId;
                sheets.spreadsheets.batchUpdate({
                    spreadsheetId: googleSheetSpreadsheetId,
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
                    } else {
                        console.log(`${result} cells appended.`);
                    }
                });
            }
        }
    }

    static async insertColumnBySheetNameToEnd(sheetName: string): Promise<void> {
        const sheets = google.sheets({ version: 'v4', auth: client });
        const sheetId = await this.getSheetIdBySheetName(sheetName);
        const maxColumn = await this.getMaxColumnBySheetName(sheetName);
        sheets.spreadsheets.batchUpdate({
            spreadsheetId: googleSheetSpreadsheetId,
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
            } else {
                console.log(`${result} cells appended.`);
            }
        });
    
    }
}

export { GooglesheetBaseServices };
