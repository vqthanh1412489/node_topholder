import { APP_MODE, COLUMN_BEGIN_DATA, EAppMode, getColumnName, getCommonName, googleSheetSpreadsheetId, insertZeroAfterAddress, removeDuplicatesItemInList } from "../utils";
import { GooglesheetBaseServices } from "../services";
import { ArrkhamProvider } from "../providers";
import { AddressMoreBalanceM, AddressWithBalanceM } from "../models";

class GooglesheetServices {
    static async getListAddressBySheetName(sheetName: string): Promise<string[]> {
        const response = await GooglesheetBaseServices.getSheetsInstance().spreadsheets.values.get({
            spreadsheetId: googleSheetSpreadsheetId,
            range: `${sheetName}!B2:B`,
        });

        const rows = response.data.values.map(row => row[0]);
        console.log('getListAddressBySheetName', rows);
        return rows
    }

    static async getAndFilterAddressesBySheetName(sheetName: string): Promise<string[]> {
        const response = await GooglesheetBaseServices.getSheetsInstance().spreadsheets.values.get({
            spreadsheetId: googleSheetSpreadsheetId,
            range: `${sheetName}!B2:B`,
        });

        const row = response.data.values.map(row => row[0]);
        const result = removeDuplicatesItemInList(row);
        return result;
    }

    static async getAddressesMoreBalance(sheetName: string): Promise<any> {
        const response = await GooglesheetBaseServices.getDatasBySheetName(sheetName);
        const result: AddressMoreBalanceM[] = [];
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
    }

    static async removeDataBeforePush(sheetName: string): Promise<void> {
        const maxColumnBySheetName = await GooglesheetBaseServices.getMaxColumnBySheetName(sheetName);
        // console.log('maxColumnBySheetName ', maxColumnBySheetName)
        if (maxColumnBySheetName < COLUMN_BEGIN_DATA + 3) {
            return;
        }
        const sheetId = await GooglesheetBaseServices.getSheetIdBySheetName(sheetName);
        GooglesheetBaseServices.getSheetsInstance().spreadsheets.batchUpdate({
            spreadsheetId: googleSheetSpreadsheetId,
            resource: {
                requests: [
                    {
                        deleteDimension: {
                            range: {
                                sheetId,
                                dimension: 'COLUMNS',
                                startIndex: COLUMN_BEGIN_DATA - 1,
                                endIndex: COLUMN_BEGIN_DATA,
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

    static async updateAddressInfo(sheetName: string, values: any) {
        const resource = {
            values,
        };

        GooglesheetBaseServices.getSheetsInstance().spreadsheets.values.update({
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
        const response = await GooglesheetBaseServices.getSheetsInstance().spreadsheets.values.get({
            spreadsheetId: googleSheetSpreadsheetId,
            range: `${sheetName}!1:1`, // Lấy dữ liệu từ hàng đầu tiên
        });

        const lastColumn = response.data.values[0].length;
        // console.log(`lastColumn ${lastColumn}`)

        const range = `${sheetName}!${getColumnName(lastColumn)}1`;
        const resource = {
            values,
        };
        await GooglesheetBaseServices.getSheetsInstance().spreadsheets.values.update({
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

            await GooglesheetBaseServices.getSheetsInstance().spreadsheets.values.append({
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

        if (APP_MODE === EAppMode.DAILY) {
            await this.removeDataBeforePush(sheetName);
        }
    }

    // static async addNameWallet(
    //     sheetName: string,
    // ): Promise<void> {
    //     var values = [];
    //     const excelItemRows = await GooglesheetBaseServices.getListAddressBySheetName(sheetName);
    //     for (let i = 0; i < excelItemRows.length; i++) {
    //         const arkhamAddressInfoM = await ArrkhamProvider.getAddressLabel(excelItemRows[i]);
    //         const entityName = getCommonName(arkhamAddressInfoM);
    //         values.push([entityName]);
    //         console.log(`Process: ${i + 1} / ${excelItemRows.length}}`)
    //         // if i == 200, delay 3 minutes
    //         if (i == 200) {
    //             await new Promise(resolve => setTimeout(resolve, 180000));
    //         }
    //     }

    //     const range = `${sheetName}!${String.fromCharCode(65 + 2)}2`;
    //     const resource = {
    //         values,
    //     };
    //     GooglesheetBaseServices.getSheetsInstance().spreadsheets.values.update({
    //         spreadsheetId: googleSheetSpreadsheetId,
    //         range,
    //         valueInputOption: 'USER_ENTERED',
    //         resource,
    //     }, (err, result) => {
    //         if (err) {
    //             console.log('The API returned an error: ' + err);
    //         } else {
    //             console.log(`${result} cells appended.`);
    //         }
    //     });
    // }
}

export { GooglesheetServices };