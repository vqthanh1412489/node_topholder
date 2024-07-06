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
exports.ExportTopholderController = void 0;
const providers_1 = require("../providers");
const services_1 = require("../services");
const utils_1 = require("../utils");
const models_1 = require("../models");
class ExportTopholderController {
    constructor() {
        this.tronNetworkProvider = new providers_1.TronNetworkProvider();
        this.chainbaseProvider = new providers_1.ChainbaseProvider();
        this.hotAddresses = [];
        this.coldAddresses = [];
        this.currentProvider = utils_1.EProvider.Chainbase;
    }
    loadHotColdAddresses() {
        return __awaiter(this, void 0, void 0, function* () {
            this.hotAddresses = yield services_1.GooglesheetServices.getAndFilterAddressesBySheetName('HOTS');
            this.coldAddresses = yield services_1.GooglesheetServices.getAndFilterAddressesBySheetName('COLDS');
        });
    }
    loadData(_a) {
        return __awaiter(this, arguments, void 0, function* ({ chainBases, excelItemRows, myToken, }) {
            let insertDataColumns = [];
            const date = new Date();
            const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
            insertDataColumns.push([dateString]);
            const mergedData = models_1.AddressWithBalanceM.mergeDuplicateAddresses(chainBases);
            const filteredData = mergedData.filter((element) => element.amount >= myToken.minBalance);
            for (const excelItemRow of excelItemRows) {
                const item = filteredData.find((e) => {
                    // console.log(`excelItemRow: ${excelItemRow} e.address: ${e.address}`);
                    if (excelItemRow && e && e.address) {
                        return excelItemRow.toLowerCase() === e.address.toLowerCase();
                    }
                    return false;
                }) || { amount: 0, address: '' };
                if (item.address !== '') {
                    insertDataColumns.push([item.amount.toString()]);
                }
                else {
                    insertDataColumns.push(['']);
                }
            }
            const differenceList = models_1.AddressWithBalanceM.findDifferenceWithExcelItem(filteredData, excelItemRows);
            yield services_1.GooglesheetBaseServices.insertColumnBySheetNameToEnd(myToken.name);
            yield services_1.GooglesheetServices.addBalanceViaDay(myToken.name, insertDataColumns, differenceList);
            yield this.onProcessData(myToken);
            console.log(`loadData ${myToken.name} done`);
        });
    }
    onExportTopHolderByDay(item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const excelItemRows = yield services_1.GooglesheetServices.getListAddressBySheetName(item.name);
                const temp = [];
                for (let indexChain = 0; indexChain < item.chains.length; indexChain++) {
                    const chain = item.chains[indexChain];
                    if (chain.eNetwork === utils_1.ENetwork.Tron) {
                        const resp = yield this.tronNetworkProvider.getTopTokenHolders(chain.address);
                        temp.push(...resp);
                        continue;
                    }
                    let page = this.currentProvider === utils_1.EProvider.Chainbase ? 1 : 0;
                    let shouldContinue = true;
                    while (shouldContinue) {
                        let resp;
                        if (this.currentProvider === utils_1.EProvider.Chainbase) {
                            resp = yield this.chainbaseProvider.getTopTokenHolders(utils_1.mapENetworkToChainbaseProvider[chain.eNetwork], chain.address, page);
                        }
                        else if (this.currentProvider === utils_1.EProvider.Covalenthq) {
                            // resp = await covalenthqProvider.getTopTokenHolders({
                            //   chainName: mapENetworkToCovalentProvider[chain.eNetwork],
                            //   tokenAddress: chain.address,
                            //   pageNumber: page,
                            //   date: DateFormat('yyyy-MM-dd').format(_selectedDate),
                            // });
                        }
                        if (resp === null) {
                            throw new Error('resp is null');
                        }
                        if (resp.length === 0) {
                            break;
                        }
                        temp.push(...resp);
                        page++;
                        shouldContinue = resp[resp.length - 1].amount >= item.minBalance;
                        // if (this.currentProvider === EProvider.Chainbase) {
                        yield new Promise((resolve) => setTimeout(resolve, 1000));
                        // }
                        console.log(`process: ${chain.address} ${page} ${temp.length}`);
                    }
                }
                // console.log(`temp ${temp.length}`);
                yield this.loadData({
                    chainBases: temp,
                    excelItemRows,
                    myToken: item,
                });
                console.log(`onExportTopHolderByDay ${item.name} done`);
            }
            catch (e) {
                console.log(`onExportTopHolderByDay Error: ${e}`);
                throw e;
            }
        });
    }
    onProcessData(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const addressesWithBalance = yield services_1.GooglesheetServices.getAddressesMoreBalance(item.name);
            const itemHotAddresses = addressesWithBalance.filter((e) => this.hotAddresses.includes(e.address));
            const itemColdAddresses = addressesWithBalance.filter((e) => this.coldAddresses.includes(e.address));
            const itemTrackingAddress = addressesWithBalance.filter((e) => e.isTracking);
            const totalPrevousAmountHotAddresses = itemHotAddresses.reduce((acc, e) => acc + e.prevousAmount, 0);
            const totalCurrentAmountHotAddresses = itemHotAddresses.reduce((acc, e) => acc + e.currentAmount, 0);
            const totalPrevousAmountColdAddresses = itemColdAddresses.reduce((acc, e) => acc + e.prevousAmount, 0);
            const totalCurrentAmountColdAddresses = itemColdAddresses.reduce((acc, e) => acc + e.currentAmount, 0);
            const totalPrevousAmountTrackingAddresses = itemTrackingAddress.reduce((acc, e) => acc + e.prevousAmount, 0);
            const totalCurrentAmountTrackingAddresses = itemTrackingAddress.reduce((acc, e) => acc + e.currentAmount, 0);
            // const a = findDuplicates(this.hotAddresses, this.coldAddresses);
            // for (const item of a) {
            //     console.log(`item: ${item}`);
            // }
            // console.log(`totalPrevousAmountHotAddresses: ${totalPrevousAmountHotAddresses}`);
            // console.log(`totalCurrentAmountHotAddresses: ${totalCurrentAmountHotAddresses}`);
            // console.log(`totalPrevousAmountColdAddresses: ${totalPrevousAmountColdAddresses}`);
            // console.log(`totalCurrentAmountColdAddresses: ${totalCurrentAmountColdAddresses}`);
            const percentHot = (0, utils_1.calculatePercentageDifference)(totalPrevousAmountHotAddresses, totalCurrentAmountHotAddresses);
            // console.log(`percentHot: ${percentHot}`);
            const percentCold = (0, utils_1.calculatePercentageDifference)(totalPrevousAmountColdAddresses, totalCurrentAmountColdAddresses);
            // console.log(`percentCold: ${percentCold}`);
            const percentTracking = (0, utils_1.calculatePercentageDifference)(totalPrevousAmountTrackingAddresses, totalCurrentAmountTrackingAddresses);
            // console.log(`percentTracking: ${percentTracking}`);
            if (Math.abs(percentHot) >= utils_1.PERCENT_HOT_WALLET_CHECK || Math.abs(percentCold) >= utils_1.PERCENT_COLD_WALLET_CHECK || Math.abs(percentTracking) >= utils_1.PERCENT_TRACKING_ALLET_CHECK) {
                const telegramService = new providers_1.TelegramServices();
                telegramService.sendMessage((0, utils_1.escapeSpecialCharacters)(`[${item.name}] Hot: ${percentHot}% Cold: ${percentCold}% Tracking: ${percentTracking}%`));
            }
        });
    }
}
exports.ExportTopholderController = ExportTopholderController;
//# sourceMappingURL=export_topholder.controller.js.map