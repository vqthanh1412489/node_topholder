import axios from 'axios';
import { ChainbaseM } from '../models/chainbase_m';
import { AddressWithBalanceM } from '../models/address_with_balance_m';
import { getRandomItem } from '../utils';

export class ChainbaseProvider {
    private readonly baseUrl: string = 'https://api.chainbase.online/v1';
    private readonly apiKeys: string[] = ['2e1SXeXTKCmUPGWTmL0bMA0WEeQ', // vqthanh1412489
        '2gDyr9wqRbNiT7JZjTriq4vrJKx', // vqthanh1
        '2gDzHFwCGzOqzGivTLYto0uEAKR', // vqthanh2
        '2gE09iWSfjeKzAOyQWPs1cnDokA', // vqthanh10
    ];

    async getTopTokenHolders(chainId: number, contractAddress: string, page: number): Promise<AddressWithBalanceM[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/token/top-holders?chain_id=${chainId}&contract_address=${contractAddress}&page=${page}&limit=100`, {
                headers: {
                    'x-api-key': getRandomItem(this.apiKeys),
                },
            });

            console.log('apikey', getRandomItem(this.apiKeys));

            if (response.status === 200) {
                const data = response.data['data'];
                const tempList = data.map((e: any) => ChainbaseM.fromJson(e));
                return AddressWithBalanceM.convertChainbaseToAddressWithBalance(tempList);
            }

            throw new Error(`ChainbaseM token/top-holders Error: ${response.data}`);
        } catch (e) {
            console.error(`ChainbaseM token/top-holders Error: ${e}`);
            throw new Error(`ChainbaseM token/top-holders Error: ${e}`);
        }
    }
}