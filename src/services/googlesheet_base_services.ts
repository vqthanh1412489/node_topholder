const { google } = require('googleapis');
import { googleSheetCredentials } from '../utils';
import appConfigSingleton from '../singletons/app_config_singleton';

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

    static async getSheetIdBySheetName(sheetName: string): Promise<number> {
        try {
            const sheets = google.sheets({ version: 'v4', auth: client });
            const response = await sheets.spreadsheets.get({
                spreadsheetId: appConfigSingleton.getGoogleSheetSpreadsheetId(),
            });

            const sheet = response.data.sheets.find(sheet => sheet.properties.title === sheetName);
            if (sheet) {
                return sheet.properties.sheetId;
            } else {
                console.log(`Sheet with name "${sheetName}" not found.`);
                return null;
            }
        } catch (err) {
            console.log('The API returned an error: getSheetIdBySheetName' + err);
            return null;
        }
    }

    static async getDatasBySheetName(sheetName: string): Promise<string[][]> {
        try {
            const sheets = google.sheets({ version: 'v4', auth: client });
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: appConfigSingleton.getGoogleSheetSpreadsheetId(),
                range: sheetName,
            });

            if (response.data.values) {
                return response.data.values;
            } else {
                console.log('No data found in the specified range.');
                return [];
            }
        } catch (err) {
            console.log('The API returned an error: getDatasBySheetName' + err);
            return [];
        }
    }

    static async getMaxColumnHaveDataBySheetName(sheetName: string): Promise<number> {
        try {
            const sheets = google.sheets({ version: 'v4', auth: client });
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: appConfigSingleton.getGoogleSheetSpreadsheetId(),
                range: `${sheetName}!1:1`,
            });
            console.log(response.data.values)

            if (response.data.values && response.data.values[0]) {
                return response.data.values[0].length;
            } else {
                console.log('No data found in the specified range.');
                return 0;
            }
        } catch (err) {
            console.log('The API returned an error: getMaxColumnHaveDataBySheetName' + err);
            return 0;
        }
    }

    static async deleteAllHiddenSheets(): Promise<void> {
        try {
            const sheets = google.sheets({ version: 'v4', auth: client });
            const response = await sheets.spreadsheets.get({
                spreadsheetId: appConfigSingleton.getGoogleSheetSpreadsheetId(),
            });

            const sheetsList = response.data.sheets;
            for (const sheet of sheetsList) {
                if (sheet.properties.hidden) {
                    const sheetId = sheet.properties.sheetId;
                    await sheets.spreadsheets.batchUpdate({
                        spreadsheetId: appConfigSingleton.getGoogleSheetSpreadsheetId(),
                        resource: {
                            requests: [
                                {
                                    deleteSheet: {
                                        sheetId,
                                    }
                                }
                            ]
                        }
                    });
                }
            }
        } catch (err) {
            console.log('The API returned an error: deleteAllHiddenSheets' + err);
        }
    }

    static async insertColumnBySheetNameToEnd(sheetName: string, maxColumn: number): Promise<void> {
        try {
            const sheets = google.sheets({ version: 'v4', auth: client });
            const sheetId = await this.getSheetIdBySheetName(sheetName);
            // const maxColumn = await this.getMaxColumnHaveDataBySheetName(sheetName);

            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: appConfigSingleton.getGoogleSheetSpreadsheetId(),
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
            });
        } catch (err) {
            console.log('The API returned an error: insertColumnBySheetNameToEnd' + err);
        }
    }

    static async insertValueByRangeStartAtA1(sheetName: string, values: any): Promise<void> {
        try {
            const resource = {
                values,
            };

            await GooglesheetBaseServices.getSheetsInstance().spreadsheets.values.update({
                spreadsheetId: appConfigSingleton.getGoogleSheetSpreadsheetId(),
                range: `${sheetName}!A1`,
                valueInputOption: 'USER_ENTERED',
                resource,
            });
        } catch (err) {
            console.log('The API returned an error: insertValueByRangeStartAtA1' + err);
        }
    }
}

export { GooglesheetBaseServices };
