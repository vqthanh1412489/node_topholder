import { AppDataSource } from "./data-source"
import { TelegramServices } from "./providers"
import { GooglesheetBaseServices, GooglesheetServices } from './services';
import { ExportTopholderController } from './controllers/export_topholder.controller'
import { myTokens } from "./utils/constants";
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
    await exportTopholderController.loadHotColdAddresses();
    console.log('Server is running...')

    // await exportTopholderController.onProcessData(myTokens.find(x => x.name === 'RPL'))
    // await exportTopholderController.onExportTopHolderByDay(myTokens.find(x => x.name === 'HOOK'))
    // GooglesheetBaseServices.deleteAllHidenSheet();

    cron.schedule('0 7,14,21 * * *', async () => {
        for (let i = 0; i < myTokens.length; i++) {
            try {
                await exportTopholderController.onExportTopHolderByDay(myTokens[i])
            } catch (error) {
                console.log(`Error: ${error.toString()}`)
                telegramService.sendMessage(`Error ${error.toString()}`);
                break
            }
        }
    }, {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh"
    });
    // GooglesheetServices.addNameWallet('MEME')
}

main()