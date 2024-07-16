import { ChainbaseProvider, CovalenthqProvider, TelegramServices, TronNetworkProvider } from "../providers";
import { GooglesheetBaseServices, GooglesheetServices } from "../services";
import { EProvider, mapENetworkToChainbaseProvider, ENetwork, calculatePercentageDifference, PERCENT_HOT_WALLET_CHECK, PERCENT_COLD_WALLET_CHECK, PERCENT_MM_WALLET_CHECK, escapeSpecialCharacters, getCurrentTimeInBangkok, mapENetworkToCovalentProvider, EWalletType, APP_MODE, EAppMode, findDifferenceWithExcelItem, convertChainbaseToAddressWithBalance, mergeDuplicateAddresses, convertCovalenthqToAddressWithBalance, } from "../utils";
import { AddressMoreBalanceM, AddressWithBalanceM, ChainbaseM, CovalenthqM, MAddressBalanceWithType, MyTokenM } from "../models";

class ExportTopholderController {
    private currentProvider: EProvider;
    private tronNetworkProvider = new TronNetworkProvider();
    private chainbaseProvider = new ChainbaseProvider();
    private covalenthqProvider = new CovalenthqProvider();

    // private hotAddresses: string[] = [];
    // private coldAddresses: string[] = [];

    private selectedDate = new Date().toISOString();

    constructor() {
        this.currentProvider = APP_MODE === EAppMode.HISTORY ? EProvider.Covalenthq : EProvider.Chainbase;
    }

    public setSelectDate(date: string): void {
        this.selectedDate = date;
    }

    private async loadData({
        addressesWithBalance,
        // excelItemRows,
        myToken,
    }: {
        addressesWithBalance: AddressWithBalanceM[];
        // excelItemRows: string[];
        myToken: MyTokenM;
    }): Promise<void> {
        const excelItemRows = await GooglesheetServices.getListAddressBySheetName(myToken.name);
        let insertDataColumns: any[] = [];
        if (APP_MODE === EAppMode.HISTORY) {
            insertDataColumns.push([this.selectedDate]);
        } else {
            insertDataColumns.push([getCurrentTimeInBangkok()]);
        }

        const mergedData = mergeDuplicateAddresses(addressesWithBalance);
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
            } else {
                insertDataColumns.push(['']);
            }
        }

        const diffAddresses = findDifferenceWithExcelItem(filteredData, excelItemRows);
        await GooglesheetBaseServices.insertColumnBySheetNameToEnd(myToken.name);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await GooglesheetServices.addBalanceViaDay(myToken.name, insertDataColumns, diffAddresses);
        // if (APP_MODE === EAppMode.DAILY) {
        //     await new Promise((resolve) => setTimeout(resolve, 3000));
        //     await this.calculateMeanDifference(myToken);
        // }

        // console.log(`loadData ${myToken.name} done`);
    }

    public async onExportTopHolderByDay(item: MyTokenM): Promise<void> {
        try {
            const addressesWithBalance: AddressWithBalanceM[] = [];

            for (let indexChain = 0; indexChain < item.chains.length; indexChain++) {
                const chain = item.chains[indexChain];
                if (chain.eNetwork === ENetwork.Tron) {
                    const resp = await this.tronNetworkProvider.getTopTokenHolders(chain.address);
                    addressesWithBalance.push(...resp);
                    continue;
                }

                let page = 0;
                let shouldContinue = true;
                while (shouldContinue) {
                    let resp: ChainbaseM;
                    // if (this.currentProvider === EProvider.Chainbase) {
                    resp = await this.chainbaseProvider.getTopTokenHolders(
                        mapENetworkToChainbaseProvider[chain.eNetwork],
                        chain.address,
                        page,
                    );
                    // } else if (this.currentProvider === EProvider.Covalenthq) {
                    //     resp = await this.covalenthqProvider.getTopTokenHolders({
                    //         chainName: mapENetworkToCovalentProvider[chain.eNetwork],
                    //         tokenAddress: chain.address,
                    //         pageNumber: page,
                    //         date: this.selectedDate,
                    //     });
                    // }

                    // if (resp === null) {
                    //     throw new Error('resp is null');
                    // }

                    // if (resp. === 0) {
                    //     break;
                    // }
                    addressesWithBalance.push(...convertChainbaseToAddressWithBalance(resp));
                    page = resp.next_page;

                    shouldContinue = parseFloat(resp.data[resp.data.length - 1].amount) >= item.minBalance;
                    // if (this.currentProvider === EProvider.Chainbase) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    // }
                    // console.log(`process: ${chain.address} ${page} ${addressesWithBalance.length}`);
                }
            }

            // console.log(`temp ${temp.length}`);
            await this.loadData({
                addressesWithBalance,
                // excelItemRows,
                myToken: item,
            });
            console.log(`onExportTopHolderByDay ${item.name} done`);
        } catch (e) {
            console.log(`onExportTopHolderByDay Error: ${e}`);
            throw e;
        }
    }

    public async onExportHistoryTopHolderByDay(item: MyTokenM): Promise<void> {
        try {
            const addressesWithBalance: AddressWithBalanceM[] = [];

            for (let indexChain = 0; indexChain < item.chains.length; indexChain++) {
                const chain = item.chains[indexChain];
                if (chain.eNetwork === ENetwork.Tron) {
                    const resp = await this.tronNetworkProvider.getTopTokenHolders(chain.address);
                    addressesWithBalance.push(...resp);
                    continue;
                }

                let page = 0;
                let shouldContinue = true;
                while (shouldContinue) {
                    let resp: CovalenthqM;
                    // if (this.currentProvider === EProvider.Chainbase) {
                    // resp = await this.chainbaseProvider.getTopTokenHolders(
                    //     mapENetworkToChainbaseProvider[chain.eNetwork],
                    //     chain.address,
                    //     page,
                    // );
                    // } else if (this.currentProvider === EProvider.Covalenthq) {
                    resp = await this.covalenthqProvider.getTopTokenHolders({
                        chainName: mapENetworkToCovalentProvider[chain.eNetwork],
                        tokenAddress: chain.address,
                        pageNumber: page,
                        date: this.selectedDate,
                    });
                    // }

                    // if (resp === null) {
                    //     throw new Error('resp is null');
                    // }

                    // if (resp. === 0) {
                    //     break;
                    // }
                    addressesWithBalance.push(...convertCovalenthqToAddressWithBalance(resp));
                    page = resp.data.pagination.page_number + 1;

                    shouldContinue = parseFloat((resp.data.items[resp.data.items.length - 1]).balance) >= item.minBalance;
                    // if (this.currentProvider === EProvider.Chainbase) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    // }
                    // console.log(`process: ${chain.address} ${page} ${addressesWithBalance.length}`);
                }
            }

            // console.log(`temp ${temp.length}`);
            await this.loadData({
                addressesWithBalance,
                // excelItemRows,
                myToken: item,
            });
            console.log(`onExportTopHolderByDay ${item.name} done`);
        } catch (e) {
            console.log(`onExportTopHolderByDay Error: ${e}`);
            throw e;
        }
    }
    // public async onExportTopHolderByDay(item: MyTokenM): Promise<void> {
    //     try {
    //         const excelItemRows = await GooglesheetServices.getListAddressBySheetName(item.name);
    //         const temp: AddressWithBalanceM[] = [];

    //         for (let indexChain = 0; indexChain < item.chains.length; indexChain++) {
    //             const chain = item.chains[indexChain];
    //             if (chain.eNetwork === ENetwork.Tron) {
    //                 const resp = await this.tronNetworkProvider.getTopTokenHolders(chain.address);
    //                 temp.push(...resp);
    //                 continue;
    //             }

    //             let page = this.currentProvider === EProvider.Chainbase ? 1 : 0;
    //             let shouldContinue = true;
    //             while (shouldContinue) {
    //                 let resp: AddressWithBalanceM[] | null;
    //                 if (this.currentProvider === EProvider.Chainbase) {
    //                     resp = await this.chainbaseProvider.getTopTokenHolders(
    //                         mapENetworkToChainbaseProvider[chain.eNetwork],
    //                         chain.address,
    //                         page,
    //                     );
    //                 } else if (this.currentProvider === EProvider.Covalenthq) {
    //                     resp = await this.covalenthqProvider.getTopTokenHolders({
    //                         chainName: mapENetworkToCovalentProvider[chain.eNetwork],
    //                         tokenAddress: chain.address,
    //                         pageNumber: page,
    //                         date: this.selectedDate,
    //                     });
    //                 }

    //                 if (resp === null) {
    //                     throw new Error('resp is null');
    //                 }

    //                 if (resp.length === 0) {
    //                     break;
    //                 }
    //                 temp.push(...resp);
    //                 page++;

    //                 shouldContinue = resp[resp.length - 1].amount >= item.minBalance;
    //                 if (this.currentProvider === EProvider.Chainbase) {
    //                     await new Promise((resolve) => setTimeout(resolve, 1000));
    //                 }
    //                 // console.log(`process: ${chain.address} ${page} ${temp.length}`);
    //             }
    //         }

    //         // console.log(`temp ${temp.length}`);
    //         await this.loadData({
    //             chainBases: temp,
    //             excelItemRows,
    //             myToken: item,
    //         });
    //         console.log(`onExportTopHolderByDay ${item.name} done`);
    //     } catch (e) {
    //         console.log(`onExportTopHolderByDay Error: ${e}`);
    //         throw e;
    //     }
    // }

    public async calculateMeanDifference(item: MyTokenM): Promise<void> {
        const addressesWithBalance: AddressMoreBalanceM[] = await GooglesheetServices.getAddressesMoreBalance(item.name);

        const hotItems = addressesWithBalance.filter((e) => e.type === EWalletType.hot);
        const coldItems = addressesWithBalance.filter((e) => e.type === EWalletType.cold);
        const mmItems = addressesWithBalance.filter((e) => e.type === EWalletType.mm);
        const childItems = addressesWithBalance.filter((e) => e.type === EWalletType.child);
        const lockItems = addressesWithBalance.filter((e) => e.type === EWalletType.lock);
        const stackingItems = addressesWithBalance.filter((e) => e.type === EWalletType.stack);
        const devItems = addressesWithBalance.filter((e) => e.type === EWalletType.dev);
        const newItems = addressesWithBalance.filter((e) => e.type === EWalletType.new);

        console.log('newItems', newItems);

        const totalPrevousAmountHotAddresses = hotItems.reduce((acc, e) => acc + e.prevousAmount, 0);
        const totalCurrentAmountHotAddresses = hotItems.reduce((acc, e) => acc + e.currentAmount, 0);

        const totalPrevousAmountColdAddresses = coldItems.reduce((acc, e) => acc + e.prevousAmount, 0);
        const totalCurrentAmountColdAddresses = coldItems.reduce((acc, e) => acc + e.currentAmount, 0);

        const totalPrevousAmountMMAddresses = mmItems.reduce((acc, e) => acc + e.prevousAmount, 0);
        const totalCurrentAmountMMAddresses = mmItems.reduce((acc, e) => acc + e.currentAmount, 0);

        const totalPrevousAmountChildAddresses = childItems.reduce((acc, e) => acc + e.prevousAmount, 0);
        const totalCurrentAmountChildAddresses = childItems.reduce((acc, e) => acc + e.currentAmount, 0);

        const totalPrevousAmountLockAddresses = lockItems.reduce((acc, e) => acc + e.prevousAmount, 0);
        const totalCurrentAmountLockAddresses = lockItems.reduce((acc, e) => acc + e.currentAmount, 0);

        const totalPrevousAmountStackingAddresses = stackingItems.reduce((acc, e) => acc + e.prevousAmount, 0);
        const totalCurrentAmountStackingAddresses = stackingItems.reduce((acc, e) => acc + e.currentAmount, 0);

        const totalPrevousAmountDevAddresses = devItems.reduce((acc, e) => acc + e.prevousAmount, 0);
        const totalCurrentAmountDevAddresses = devItems.reduce((acc, e) => acc + e.currentAmount, 0);

        // const totalPrevousAmountNewAddresses = newItems.reduce((acc, e) => acc + e.prevousAmount, 0);
        const totalCurrentAmountNewAddresses = newItems.reduce((acc, e) => acc + e.currentAmount, 0);


        const percentHot = calculatePercentageDifference(totalPrevousAmountHotAddresses, totalCurrentAmountHotAddresses);
        const percentCold = calculatePercentageDifference(totalPrevousAmountColdAddresses, totalCurrentAmountColdAddresses);
        const percentMM = calculatePercentageDifference(totalPrevousAmountMMAddresses, totalCurrentAmountMMAddresses);
        const percentChild = calculatePercentageDifference(totalPrevousAmountChildAddresses, totalCurrentAmountChildAddresses);
        const percentLock = calculatePercentageDifference(totalPrevousAmountLockAddresses, totalCurrentAmountLockAddresses);
        const percentStacking = calculatePercentageDifference(totalPrevousAmountStackingAddresses, totalCurrentAmountStackingAddresses);
        const percentDev = calculatePercentageDifference(totalPrevousAmountDevAddresses, totalCurrentAmountDevAddresses);

        console.log(`[${item.name}] Hot: ${percentHot}% Cold: ${percentCold}% MM: ${percentMM}% Child: ${percentChild}% Lock: ${percentLock}% Stacking: ${percentStacking}% Dev: ${percentDev}%`);


        if (Math.abs(percentHot) >= PERCENT_HOT_WALLET_CHECK || Math.abs(percentCold) >= PERCENT_COLD_WALLET_CHECK || Math.abs(percentMM) >= PERCENT_MM_WALLET_CHECK || Math.abs(percentChild) >= PERCENT_MM_WALLET_CHECK || Math.abs(percentLock) >= PERCENT_MM_WALLET_CHECK || Math.abs(percentStacking) >= PERCENT_MM_WALLET_CHECK || Math.abs(percentDev) >= PERCENT_MM_WALLET_CHECK) {
            const telegramService = new TelegramServices();
            telegramService.sendMessage(escapeSpecialCharacters(`[${item.name}] Hot: ${percentHot}% Cold: ${percentCold}% MM: ${percentMM}% Child: ${percentChild}% Lock: ${percentLock}% Stacking: ${percentStacking}% Dev: ${percentDev}% New: ${totalCurrentAmountNewAddresses} `));
        }
    }

    public async onAnalysisHistoryData(readSheetName: string, writeSheetName: string): Promise<void> {
        const value = []
        value.push(['Date', 'Hot', 'Cold', 'MM', 'Child', 'Lock', 'Stacking', 'Dev']);
        const matrixData = await GooglesheetBaseServices.getDatasBySheetName(readSheetName);

        for (let k = 3; k < matrixData[0].length; k++) {
            let colIndex = k;
            const addressBalanceWithTypes: MAddressBalanceWithType[] = [];
            for (let rowIndex = 1; rowIndex < matrixData.length; rowIndex++) {
                const address = matrixData[rowIndex][1];
                const type = matrixData[rowIndex][2];
                const amount = matrixData[rowIndex][colIndex] !== '' && matrixData[rowIndex][colIndex] ? parseFloat(matrixData[rowIndex][colIndex]) : 0;
                addressBalanceWithTypes.push({ address, amount, type });
            }

            // console.log(addressBalanceWithTypes);
            const hotItems = addressBalanceWithTypes.filter((e) => e.type === EWalletType.hot);
            const coldItems = addressBalanceWithTypes.filter((e) => e.type === EWalletType.cold);
            const mmItems = addressBalanceWithTypes.filter((e) => e.type === EWalletType.mm);
            const childItems = addressBalanceWithTypes.filter((e) => e.type === EWalletType.child);
            const lockItems = addressBalanceWithTypes.filter((e) => e.type === EWalletType.lock);
            const stackingItems = addressBalanceWithTypes.filter((e) => e.type === EWalletType.stack);
            const devItems = addressBalanceWithTypes.filter((e) => e.type === EWalletType.dev);

            // console.log('hotItems', hotItems)

            const totalHotItems = hotItems.reduce((acc, e) => acc + e.amount, 0);
            const totalColdItems = coldItems.reduce((acc, e) => acc + e.amount, 0);
            const totalMMItems = mmItems.reduce((acc, e) => acc + e.amount, 0);
            const totalChildItems = childItems.reduce((acc, e) => acc + e.amount, 0);
            const totalLockItems = lockItems.reduce((acc, e) => acc + e.amount, 0);
            const totalStackingItems = stackingItems.reduce((acc, e) => acc + e.amount, 0);
            const totalDevItems = devItems.reduce((acc, e) => acc + e.amount, 0);

            // console.log(`totalHotItems: ${totalHotItems}`);
            // console.log(`totalColdItems: ${totalColdItems}`);

            value.push([
                matrixData[0][colIndex],
                totalHotItems,
                totalColdItems,
                totalMMItems,
                totalChildItems,
                totalLockItems,
                totalStackingItems,
                totalDevItems,
            ]);
        }
        // console.log(value);
        GooglesheetBaseServices.insertValueByRangeStartAtA1(writeSheetName, value);
    }
}

export { ExportTopholderController };