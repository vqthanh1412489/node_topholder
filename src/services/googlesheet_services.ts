const { google } = require('googleapis');
import { getCommonName, googleSheetCredentials, googleSheetSpreadsheetId, insertZeroAfterAddress } from '../utils';
import { AddressWithBalanceM } from '../models';
import { ArrkhamProvider } from '../providers';


const client = new google.auth.JWT(
    googleSheetCredentials.client_email,
    null,
    googleSheetCredentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

class GooglesheetServices {
    static async getListAddressBySheetName(sheetName: string): Promise<string[]> {
        const sheets = google.sheets({ version: 'v4', auth: client });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: googleSheetSpreadsheetId,
            range: `${sheetName}!B2:B`,
        });

        const rows = response.data.values.map(row => row[0]);
        return rows
    }

    static async updateAddressInfo(sheetName: string, values: any) {
        const sheets = google.sheets({ version: 'v4', auth: client });
        const resource = {
            values,
        };

        sheets.spreadsheets.values.update({
            spreadsheetId: googleSheetSpreadsheetId,
            range: `${sheetName}!C1`,
            valueInputOption: 'USER_ENTERED',
            resource,
        }, (err, result) => {
            if (err) {
                console.log('The API returned an error: ' + err);
            } else {
                console.log(`${result} cells appended.`);
            }
        });
    }

    static async addBalanceViaDay(
        sheetName: string,
        values: any,
        differenceList: AddressWithBalanceM[] = [],
    ): Promise<void> {
        const sheets = google.sheets({ version: 'v4', auth: client });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: googleSheetSpreadsheetId,
            range: `${sheetName}!1:1`, // Lấy dữ liệu từ hàng đầu tiên
        });

        const lastColumn = response.data.values[0].length;
        console.log(`lastColumn ${lastColumn}`)

        const range = `${sheetName}!${String.fromCharCode(65 + lastColumn)}1`;
        const resource = {
            values,
        };
        sheets.spreadsheets.values.update({
            spreadsheetId: googleSheetSpreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            resource,
        }, (err, result) => {
            if (err) {
                console.log('The API returned an error: ' + err);
            } else {
                console.log(`${result} cells appended.`);
            }
        });

        if (differenceList.length > 0) {
            const result: string[][] = [];
            for (const e of differenceList) {
                const arkhamAddressInfoM = await ArrkhamProvider.getAddressLabel(e.address);
                const entityName = getCommonName(arkhamAddressInfoM);
                // console.log('e.address,', e.address);

                result.push(
                    insertZeroAfterAddress(
                        [
                            entityName,
                            e.address,
                            e.amount,
                        ],
                        lastColumn - 2,
                        e.address,
                    ),
                );
            }

            const resource = {
                values: result,
            };

            sheets.spreadsheets.values.append({
                spreadsheetId: googleSheetSpreadsheetId,
                range: `${sheetName}!A1`,
                valueInputOption: 'USER_ENTERED',
                resource,
            }, (err, result) => {
                if (err) {
                    console.log('The API returned an error: ' + err);
                } else {
                    console.log(`${result.data.updates.updatedCells} cells appended.`);
                }
            });
        }
    }
}

export { GooglesheetServices };
