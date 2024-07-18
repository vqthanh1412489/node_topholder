import { classifyStringToTag, COLUMN_BEGIN_DATA, EWalletType, getColumnName, getCommonName, insertZeroAfterAddress, removeDuplicatesItemInList } from "../utils";
import { GooglesheetBaseServices } from "../services";
import { ArrkhamProvider } from "../providers";
import { AddressMoreBalanceM, AddressWithBalanceM } from "../models";
import appConfigSingleton from '../singletons/app_config_singleton';

class GooglesheetServices {
    static async getListAddressBySheetName(sheetName: string): Promise<string[]> {
        try {
            const response = await GooglesheetBaseServices.getSheetsInstance().spreadsheets.values.get({
                spreadsheetId: appConfigSingleton.getGoogleSheetSpreadsheetId(),
                range: `${sheetName}!B2:B`,
            });

            const rows = response.data.values.map(row => row[0]);
            // console.log('getListAddressBySheetName', rows);
            return rows;
        } catch (err) {
            console.log('The API returned an error: ' + err);
            return [];
        }
    }

    static async getAndFilterAddressesBySheetName(sheetName: string): Promise<string[]> {
        try {
            const response = await GooglesheetBaseServices.getSheetsInstance().spreadsheets.values.get({
                spreadsheetId: appConfigSingleton.getGoogleSheetSpreadsheetId(),
                range: `${sheetName}!B2:B`,
            });

            const rows = response.data.values.map(row => row[0]);
            const result = removeDuplicatesItemInList(rows);
            return result;
        } catch (err) {
            console.log('The API returned an error: ' + err);
            return [];
        }
    }

    static async getAddressesMoreBalance(sheetName: string): Promise<any> {
        try {
            const response = await GooglesheetBaseServices.getDatasBySheetName(sheetName);
            const result: AddressMoreBalanceM[] = [];

            for (let i = 1; i < response.length; i++) {
                const item = response[i];
                result.push({
                    address: item[1],
                    prevousAmount: parseFloat(item[6]),
                    currentAmount: parseFloat(item[7]),
                    type: EWalletType[item[3]],
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
        } catch (err) {
            console.log('The API returned an error: ' + err);
            return [];
        }
    }


    static async removePrevousDataColumeOnGoogleSheet(sheetName: string, maxColumn: number): Promise<void> {
        try {
            if (maxColumn < COLUMN_BEGIN_DATA + 4) {
                return;
            }
            const sheetId = await GooglesheetBaseServices.getSheetIdBySheetName(sheetName);
            await GooglesheetBaseServices.getSheetsInstance().spreadsheets.batchUpdate({
                spreadsheetId: appConfigSingleton.getGoogleSheetSpreadsheetId(),
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
            });
        } catch (err) {
            console.log('The API returned an error: ' + err);
        }
    }


    // static async updateAddressInfo(sheetName: string, values: any) {
    //     const resource = {
    //         values,
    //     };

    //     GooglesheetBaseServices.getSheetsInstance().spreadsheets.values.update({
    //         spreadsheetId: appConfigSingleton.getGoogleSheetSpreadsheetId(),
    //         range: `${sheetName}!C1`,
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

    static async pushNewDataToGoogleSheet(
        sheetName: string,
        maxColumn: number,
        values: any,
        differenceList: AddressWithBalanceM[] = [],
    ): Promise<void> {
        try {
            const range = `${sheetName}!${getColumnName(maxColumn)}1`;
            const resource = {
                values,
            };
            await GooglesheetBaseServices.getSheetsInstance().spreadsheets.values.update({
                spreadsheetId: appConfigSingleton.getGoogleSheetSpreadsheetId(),
                range,
                valueInputOption: 'USER_ENTERED',
                resource,
            });

            if (differenceList.length > 0) {
                const result: string[][] = [];
                for (const e of differenceList) {
                    const arkhamAddressInfoM = await ArrkhamProvider.getAddressLabel(e.address);
                    const entityName = getCommonName(arkhamAddressInfoM);
                    const type = classifyStringToTag(entityName);
                    // console.log('entityName', entityName);
                    // console.log('type', type);

                    result.push(
                        insertZeroAfterAddress(
                            [
                                entityName,
                                e.address,
                                type,
                                e.amount,
                            ],
                            maxColumn - 4,
                            e.address,
                        ),
                    );
                }

                const resource = {
                    values: result,
                };

                await GooglesheetBaseServices.getSheetsInstance().spreadsheets.values.append({
                    spreadsheetId: appConfigSingleton.getGoogleSheetSpreadsheetId(),
                    range: `${sheetName}!A1`,
                    valueInputOption: 'USER_ENTERED',
                    resource,
                });
            }
        } catch (error) {
            console.log('The API returned an error: pushNewDataToGoogleSheet' + error);
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
    //         spreadsheetId: googleSheetSingleton.getGoogleSheetSpreadsheetId(),
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