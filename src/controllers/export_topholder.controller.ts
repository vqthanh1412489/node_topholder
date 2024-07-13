import { ChainbaseProvider, CovalenthqProvider, TelegramServices, TronNetworkProvider } from "../providers";
import { GooglesheetBaseServices, GooglesheetServices } from "../services";
import { EProvider, mapENetworkToChainbaseProvider, ENetwork, calculatePercentageDifference, PERCENT_HOT_WALLET_CHECK, PERCENT_COLD_WALLET_CHECK, PERCENT_TRACKING_ALLET_CHECK, escapeSpecialCharacters, getCurrentTimeInBangkok, mapENetworkToCovalentProvider, EWalletType, APP_MODE, EAppMode, findDifferenceWithExcelItem, } from "../utils";
import { AddressMoreBalanceM, AddressWithBalanceM, MAddressBalanceWithType, MyTokenM } from "../models";

class ExportTopholderController {
    private currentProvider: EProvider;
    private tronNetworkProvider = new TronNetworkProvider();
    private chainbaseProvider = new ChainbaseProvider();
    private covalenthqProvider = new CovalenthqProvider();

    private hotAddresses: string[] = [];
    private coldAddresses: string[] = [];

    private selectedDate = new Date().toISOString();

    constructor() {
        this.currentProvider = APP_MODE === EAppMode.HISTORY ? EProvider.Covalenthq : EProvider.Chainbase;
    }

    public setSelectDate(date: string): void {
        this.selectedDate = date;
    }

    public async loadHotColdAddresses(): Promise<void> {
        this.hotAddresses = await GooglesheetServices.getAndFilterAddressesBySheetName('HOTS');
        this.coldAddresses = await GooglesheetServices.getAndFilterAddressesBySheetName('COLDS');
    }

    private async loadData({
        chainBases,
        excelItemRows,
        myToken,
    }: {
        chainBases: AddressWithBalanceM[];
        excelItemRows: string[];
        myToken: MyTokenM;
    }): Promise<void> {
        let insertDataColumns: any[] = [];
        if (APP_MODE === EAppMode.HISTORY) {
            insertDataColumns.push([this.selectedDate]);
        } else {
            insertDataColumns.push([getCurrentTimeInBangkok()]);
        }

        const mergedData = AddressWithBalanceM.mergeDuplicateAddresses(chainBases);
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

        const differenceList = findDifferenceWithExcelItem(filteredData, excelItemRows);
        await GooglesheetBaseServices.insertColumnBySheetNameToEnd(myToken.name);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await GooglesheetServices.addBalanceViaDay(myToken.name, insertDataColumns, differenceList);
        if (APP_MODE === EAppMode.DAILY) {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            await this.onProcessData(myToken);
        }

        console.log(`loadData ${myToken.name} done`);
    }

    public async onExportTopHolderByDay(item: MyTokenM): Promise<void> {
        try {
            const excelItemRows = await GooglesheetServices.getListAddressBySheetName(item.name);
            const temp: AddressWithBalanceM[] = [];

            for (let indexChain = 0; indexChain < item.chains.length; indexChain++) {
                const chain = item.chains[indexChain];
                if (chain.eNetwork === ENetwork.Tron) {
                    const resp = await this.tronNetworkProvider.getTopTokenHolders(chain.address);
                    temp.push(...resp);
                    continue;
                }

                let page = this.currentProvider === EProvider.Chainbase ? 1 : 0;
                let shouldContinue = true;
                while (shouldContinue) {
                    let resp: AddressWithBalanceM[] | null;
                    if (this.currentProvider === EProvider.Chainbase) {
                        resp = await this.chainbaseProvider.getTopTokenHolders(
                            mapENetworkToChainbaseProvider[chain.eNetwork],
                            chain.address,
                            page,
                        );
                    } else if (this.currentProvider === EProvider.Covalenthq) {
                        resp = await this.covalenthqProvider.getTopTokenHolders({
                            chainName: mapENetworkToCovalentProvider[chain.eNetwork],
                            tokenAddress: chain.address,
                            pageNumber: page,
                            date: this.selectedDate,
                        });
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
                    if (this.currentProvider === EProvider.Chainbase) {
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                    }
                    // console.log(`process: ${chain.address} ${page} ${temp.length}`);
                }
            }

            // console.log(`temp ${temp.length}`);
            await this.loadData({
                chainBases: temp,
                excelItemRows,
                myToken: item,
            });
            console.log(`onExportTopHolderByDay ${item.name} done`);
        } catch (e) {
            console.log(`onExportTopHolderByDay Error: ${e}`);
            throw e;
        }
    }

    public async onProcessData(item: MyTokenM): Promise<void> {
        const addressesWithBalance: AddressMoreBalanceM[] = await GooglesheetServices.getAddressesMoreBalance(item.name);

        const itemHotAddresses = addressesWithBalance.filter((e) => this.hotAddresses.includes(e.address.toLowerCase()));
        const itemColdAddresses = addressesWithBalance.filter((e) => {
            // console.log(`e.address: ${e.address}, prevousAmount ${e.prevousAmount}, currentAmount ${e.currentAmount}`);
            return this.coldAddresses.includes(e.address.toLowerCase());
        });
        const itemTrackingAddress = addressesWithBalance.filter((e) => e.isTracking);

        const totalPrevousAmountHotAddresses = itemHotAddresses.reduce((acc, e) => acc + e.prevousAmount, 0);
        const totalCurrentAmountHotAddresses = itemHotAddresses.reduce((acc, e) => acc + e.currentAmount, 0);

        const totalPrevousAmountColdAddresses = itemColdAddresses.reduce((acc, e) => acc + e.prevousAmount, 0);
        const totalCurrentAmountColdAddresses = itemColdAddresses.reduce((acc, e) => acc + e.currentAmount, 0);

        const totalPrevousAmountTrackingAddresses = itemTrackingAddress.reduce((acc, e) => acc + e.prevousAmount, 0);
        const totalCurrentAmountTrackingAddresses = itemTrackingAddress.reduce((acc, e) => acc + e.currentAmount, 0);

        // console.log(`totalPrevousAmountHotAddresses: ${totalPrevousAmountHotAddresses}`);
        // console.log(`totalCurrentAmountHotAddresses: ${totalCurrentAmountHotAddresses}`);
        // console.log(`totalPrevousAmountColdAddresses: ${totalPrevousAmountColdAddresses}`);
        // console.log(`totalCurrentAmountColdAddresses: ${totalCurrentAmountColdAddresses}`);

        const percentHot = calculatePercentageDifference(totalPrevousAmountHotAddresses, totalCurrentAmountHotAddresses);
        // console.log(`percentHot: ${percentHot}`);

        const percentCold = calculatePercentageDifference(totalPrevousAmountColdAddresses, totalCurrentAmountColdAddresses);
        // console.log(`percentCold: ${percentCold}`);

        const percentTracking = calculatePercentageDifference(totalPrevousAmountTrackingAddresses, totalCurrentAmountTrackingAddresses);
        // console.log(`percentTracking: ${percentTracking}`);

        if (Math.abs(percentHot) >= PERCENT_HOT_WALLET_CHECK || Math.abs(percentCold) >= PERCENT_COLD_WALLET_CHECK || Math.abs(percentTracking) >= PERCENT_TRACKING_ALLET_CHECK) {
            const telegramService = new TelegramServices();
            telegramService.sendMessage(escapeSpecialCharacters(`[${item.name}] Hot: ${percentHot}% Cold: ${percentCold}% Tracking: ${percentTracking}%`));
        }
    }

    public async onAnalysisHistoryData(sheetName: string): Promise<void> {
        const value = []
        value.push(['Date', 'Hot', 'Cold', 'MM', 'Child', 'Lock', 'Stacking', 'Dev']);
        const matrixData = await GooglesheetBaseServices.getDatasBySheetName(sheetName);

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
            const hotItems = addressBalanceWithTypes.filter((e) => e.type === EWalletType.HOT);
            const coldItems = addressBalanceWithTypes.filter((e) => e.type === EWalletType.COLD);
            const mmItems = addressBalanceWithTypes.filter((e) => e.type === EWalletType.MM);
            const childItems = addressBalanceWithTypes.filter((e) => e.type === EWalletType.CHILD);
            const lockItems = addressBalanceWithTypes.filter((e) => e.type === EWalletType.LOCK);
            const stackingItems = addressBalanceWithTypes.filter((e) => e.type === EWalletType.STACKING);
            const devItems = addressBalanceWithTypes.filter((e) => e.type === EWalletType.DEV);

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
        GooglesheetBaseServices.insertValueByRangeStartAtA1('0x0_CHART', value);
    }
}

export { ExportTopholderController };