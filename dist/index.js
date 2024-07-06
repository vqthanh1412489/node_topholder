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
const providers_1 = require("./providers");
const services_1 = require("./services");
const export_topholder_controller_1 = require("./controllers/export_topholder.controller");
const constants_1 = require("./utils/constants");
const cron = require('node-cron');
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const exportTopholderController = new export_topholder_controller_1.ExportTopholderController();
        const googlesheetServices = new services_1.GooglesheetServices();
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
        yield exportTopholderController.loadHotColdAddresses();
        // await exportTopholderController.onProcessData(myTokens[2])
        // await exportTopholderController.onExportTopHolderByDay(myTokens.find(x => x.name === 'HOOK'))
        // GooglesheetBaseServices.deleteAllHidenSheet();
        // cron.schedule('*/30 * * * * *', async () => {
        cron.schedule('0 7,14,21 * * *', () => __awaiter(this, void 0, void 0, function* () {
            let countItemSuccess = 0;
            for (let i = 0; i < constants_1.myTokens.length; i++) {
                try {
                    yield exportTopholderController.onExportTopHolderByDay(constants_1.myTokens[i]);
                    countItemSuccess++;
                }
                catch (error) {
                    console.log(`Error: ${error.toString()}`);
                    break;
                }
            }
            const telegramService = new providers_1.TelegramServices();
            telegramService.sendMessage(`${countItemSuccess === constants_1.myTokens.length ? 'All' : countItemSuccess} items are exported successfully`);
        }), {
            scheduled: true,
            timezone: "Asia/Ho_Chi_Minh"
        });
        // GooglesheetServices.addNameWallet('MEME')
        // ArrkhamProvider.getNumberOfTransactions('0xb937bf362cd897e05eb3d351575598c4f9b55839');
    });
}
main();
//# sourceMappingURL=index.js.map