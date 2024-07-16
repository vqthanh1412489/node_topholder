import { ArrkhamProvider, TelegramServices } from "./providers"
import { GooglesheetBaseServices, GooglesheetServices } from './services';
import { ExportTopholderController } from './controllers/export_topholder.controller'
import { APP_MODE, myTokens } from "./utils/constants";
import { EAppMode, escapeSpecialCharacters, getMondays } from "./utils";
import googleSheetSingleton from './singletons/app_config_singleton';
const cron = require('node-cron');

async function main() {
    const exportTopholderController = new ExportTopholderController();
    const telegramService = new TelegramServices();
    // const googlesheetServices = new GooglesheetServices();
    // AppDataSource.initialize().then(async () => {
    //     const rows = await GooglesheetServices.getListAddressBySheetName('USDC');

    //     // update label for addresses
    //     // const rowData = [['Chain', 'Entity', 'Entity Label', 'Type']];
    //     // for (const item of rows) {
    //     //     let resp = await AppDataSource.manager.findOne(ArkhamAddressInfo, { where: { is_done: 1, address: item } })
    //     //     if (resp != null) {
    //     //         rowData.push([resp.chain, resp.entity, resp.entity_lable, resp.type])
    //     //     }
    //     // }
    //     // await GooglesheetServices.updateAddressInfo('USDC', rowData)

    // save addresses to database
    // for (let i = 0; i < rows.length; i++) {
    //     const temp = new ArkhamAddressInfo()
    //     temp.address = rows[i]
    //     await AppDataSource.manager.save(temp);
    //     console.log(`Process: ${i + 1} / ${rows.length} at ${new Date().toISOString()}`)
    // }

    //     AppDataSource.destroy().then(() => {
    //         console.log('Connection closed')
    //     }).catch(error => console.log(error))
    // }).catch(error => console.log(error))
    // await exportTopholderController.onProcessData(myTokens.find(x => x.name === 'RPL'))
    // await exportTopholderController.onExportTopHolderByDay(myTokens.find(x => x.name === 'HOOK'))
    // GooglesheetBaseServices.deleteAllHidenSheet();
    // GooglesheetServices.addNameWallet('MEME')
    console.log('Server is running: ', APP_MODE)
    switch (APP_MODE) {
        case EAppMode.DAILY:
            // cron.schedule('5,8 16 * * *', async () => {
            cron.schedule('0 7 * * *', async () => {
                googleSheetSingleton.setGoogleSheetSpreadsheetId('1MLn8hD0CY-s13brglra_KBOOiuDIfuL2CvQ6m4wM78I');// DATA
                for (let i = 0; i < myTokens.length; i++) {
                    try {
                        await exportTopholderController.onExportTopHolderByDay(myTokens[i])
                    } catch (error) {
                        console.log(`Error: ${error.toString()}`)
                        telegramService.sendMessage(escapeSpecialCharacters(`Error ${error.toString()}`));
                        break
                    }
                }
            }, {
                scheduled: true,
                timezone: "Asia/Ho_Chi_Minh"
            });

            // cron.schedule('6,7 16 * * *', async () => {
            cron.schedule('0 8,14,21 * * *', async () => {
                googleSheetSingleton.setGoogleSheetSpreadsheetId('1dY7ZLqimh9uvYGpfm6pGX3xo8ggeJdu7SRM51Oz0Pt4');// TEST
                for (let i = 0; i < myTokens.length; i++) {
                    try {
                        await exportTopholderController.onExportTopHolderByDay(myTokens[i])
                    } catch (error) {
                        console.log(`Error: ${error.toString()}`)
                        telegramService.sendMessage(escapeSpecialCharacters(`Error ${error.toString()}`));
                        break
                    }
                }
            }, {
                scheduled: true,
                timezone: "Asia/Ho_Chi_Minh"
            });
            break;
        case EAppMode.HISTORY:
            googleSheetSingleton.setGoogleSheetSpreadsheetId('1dY7ZLqimh9uvYGpfm6pGX3xo8ggeJdu7SRM51Oz0Pt4');// TEST
            const START_TIME = new Date('2020-10-23');
            const dates = getMondays(START_TIME, new Date().toISOString());
            for (let i = 0; i < dates.length; i++) {
                exportTopholderController.setSelectDate(dates[i]);
                await exportTopholderController.onExportHistoryTopHolderByDay(myTokens.find(x => x.name === 'AUDIO'))
                //delay 2 second
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            break;
        case EAppMode.ANALYSIS_HISTORY:
            exportTopholderController.onAnalysisHistoryData('0x0', '0x0_CHART');
            break;
        case EAppMode.TEST:
            googleSheetSingleton.setGoogleSheetSpreadsheetId('1dY7ZLqimh9uvYGpfm6pGX3xo8ggeJdu7SRM51Oz0Pt4');// TEST
            // exportTopholderController.calculateMeanDifference(myTokens.find(x => x.name === 'HOOK'));
            // await exportTopholderController.onExportTopHolderByDay(myTokens.find(x => x.name === 'HOOK'))
            for (let i = 0; i < myTokens.length; i++) {
                try {
                    await exportTopholderController.onExportTopHolderByDay(myTokens[i])
                } catch (error) {
                    console.log(`Error: ${error.toString()}`)
                    telegramService.sendMessage(`Error ${error.toString()}`);
                    break
                }
            }
            break;
        default:
            console.log('Invalid mode')
            break;
    }
    // const arkhamAddressInfoM = await ArrkhamProvider.getAddressLabel('0x8144c696ee8e124ea7b05c8ca69f736787c71bd7');
    // const entityName = getCommonName(arkhamAddressInfoM);
    // console.log(entityName)

}

main()