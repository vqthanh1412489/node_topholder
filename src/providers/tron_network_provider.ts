import axios, { AxiosRequestConfig } from 'axios';
import { AddressWithBalanceM, TronNetworkM } from '../models';

export class TronNetworkProvider {
    private readonly baseUrl: string = 'https://api.trongrid.io/v1/';
    private readonly apiKey: string = '5920e0b3-8a75-4dba-a108-de0027bf573c';

    async getTopTokenHolders(tokenAddress: string): Promise<AddressWithBalanceM[]> {
        try {
            const queryParameters = {
                'order_by': 'balance,desc',
                'limit': '100',
            };

            const endPoint = `contracts/${tokenAddress}/tokens`;
            // console.log(`endPoint: ${endPoint}`);

            const config: AxiosRequestConfig = {
                headers: {
                    'TRON-PRO-API-KEY': this.apiKey,
                },
                params: queryParameters,
            };

            const response = await axios.get(`${this.baseUrl}${endPoint}`, config);
            // console.log('response: ', response.data);

            if (response.status === 200 && response.data && response.data['data']) {
                const data = response.data['data'].map((e: any) => TronNetworkM.fromJson(e));
                return AddressWithBalanceM.convertTronNetworkToAddressWithBalance(data);
            }

            throw new Error(`TronNetworkProvider getTopTokenHolders Error: ${response.data}`);
        } catch (error) {
            console.log(`TronNetworkProvider getTopTokenHolders Error: ${error}`);
            throw error;
        }
    }
}
