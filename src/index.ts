import { AppDataSource } from "./data-source"
import { ArkhamAddressInfo } from "./entity/address_info.entity"
import { ArrkhamProvider, ChainbaseProvider, TronNetworkProvider, TelegramServices } from "./providers"
import { GooglesheetServices } from './services';
import { ExportTopholderController } from './controllers/export_topholder.controller'
import { myTokens } from "./utils/constants";
const cron = require('node-cron');

async function main() {
    const exportTopholderController = new ExportTopholderController();
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


    //     // get all addresses from db and update label
    //     // const addresses = await AppDataSource.manager.find(ArkhamAddressInfo, { where: { is_done: 0 } })
    //     // for (let index = 0; index < addresses.length; index++) {
    //     //     try {
    //     //         var data = await ArrkhamProvider.getAddressLabel(addresses[index].address)
    //     //         const address = new ArkhamAddressInfo()
    //     //         address.address = data.address
    //     //         address.chain = data.getChain()
    //     //         address.entity = data.getEntityName()
    //     //         address.entity_lable = data.getArkhamLabel()
    //     //         address.type = data.getType()
    //     //         address.is_done = 1

    //     //         // update data
    //     //         await AppDataSource.manager.update(ArkhamAddressInfo, addresses[index].id, address)
    //     //         console.log(`Process: ${index + 1} / ${addresses.length}`)
    //     //     } catch (error) {
    //     //         // stop process
    //     //         console.log('Error: ', error)
    //     //         break
    //     //     }
    //     // }

    //     console.log('Done!')

    //     AppDataSource.destroy().then(() => {
    //         console.log('Connection closed')
    //     }).catch(error => console.log(error))
    // }).catch(error => console.log(error))


    // cron.schedule('*/30 * * * * *', async () => {
    cron.schedule('0 7 * * *', async () => {
        let countItemSuccess = 0;
        for (let i = 0; i < myTokens.length; i++) {
            try {
                await exportTopholderController.onExportTopHolderByDay(myTokens[i])
                countItemSuccess++;
            } catch (error) {
                console.log(`Error: ${error.toString()}`)
                break
            }
        }

        const telegramService = new TelegramServices();
        telegramService.sendMessage(`${countItemSuccess === myTokens.length ? 'All' : countItemSuccess} items are exported successfully`);
    }, {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh"
    });
}

main()