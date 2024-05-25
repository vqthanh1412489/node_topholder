import { ChainbaseProvider, TronNetworkProvider } from "../providers";
import { GooglesheetServices } from "../services";
import { EProvider, mapENetworkToChainbaseProvider, ENetwork } from "../utils";
import { AddressWithBalanceM, MyTokenM } from "../models";

class ExportTopholderController {
    private currentProvider: EProvider;
    private tronNetworkProvider = new TronNetworkProvider();
    private chainbaseProvider = new ChainbaseProvider();

    constructor() {
        this.currentProvider = EProvider.Chainbase;
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
        const date = new Date();
        const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        insertDataColumns.push([dateString]);

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

        const differenceList = AddressWithBalanceM.findDifferenceWithExcelItem(filteredData, excelItemRows);

        // if (differenceList.length > 0) {
        //     for (const e of differenceList) {
        //         insertDataColumns.push([e.amount.toString()]);
        //     }
        // }

        await GooglesheetServices.addBalanceViaDay(myToken.name, insertDataColumns, differenceList);

        console.log(`loadData ${myToken.name} done`);
    }

    public async onExportTopHolderByDay(item: MyTokenM): Promise<void> {
        try {
            console.log(`onExportTopHolderByDay ${item.name}`);
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
                    await new Promise((resolve) => setTimeout(resolve, 200));
                    // }
                    console.log(`process: ${chain.address} ${page} ${temp.length}`);
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
}

export { ExportTopholderController };