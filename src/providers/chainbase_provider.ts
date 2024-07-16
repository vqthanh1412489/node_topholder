import axios from 'axios';
import { getRandomItem } from '../utils';
import { ChainbaseM } from '../models';

export class ChainbaseProvider {
    private readonly baseUrl: string = 'https://api.chainbase.online/v1';
    private readonly apiKeys: string[] = ['2e1SXeXTKCmUPGWTmL0bMA0WEeQ', // vqthanh1412489
        '2gDyr9wqRbNiT7JZjTriq4vrJKx', // vqthanh1
        '2gDzHFwCGzOqzGivTLYto0uEAKR', // vqthanh2
        '2gE09iWSfjeKzAOyQWPs1cnDokA', // vqthanh10
    ];

    async getTopTokenHolders(chainId: number, contractAddress: string, page: number): Promise<ChainbaseM> {
        try {
            const endPoint = `${this.baseUrl}/token/top-holders?chain_id=${chainId}&contract_address=${contractAddress}&page=${page}&limit=100`;
            const response = await axios.get(endPoint, {
                headers: {
                    'x-api-key': getRandomItem(this.apiKeys),
                },
            });

            console.log('endPoint:', endPoint);

            if (response.status === 200 && response.data['code'] === 0 && response.data['message'] === 'ok') {
                // console.log('response.data:', response.data);
                return response.data
            }

            throw new Error(`ChainbaseM token/top-holders Error: ${response.data}`);
        } catch (e) {
            console.error(`ChainbaseM token/top-holders Error: ${e}`);
            throw new Error(`ChainbaseM token/top-holders Error: ${e}`);
        }
    }
}