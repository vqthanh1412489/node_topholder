import axios from 'axios';
import { ChainbaseM } from '../models';

export class ChainbaseProvider {
    private readonly baseUrl: string = 'https://api.chainbase.online/v1';
    private readonly apiKeys: string[] = ['2e1SXeXTKCmUPGWTmL0bMA0WEeQ', // vqthanh1412489
        '2gDyr9wqRbNiT7JZjTriq4vrJKx', // vqthanh1
        '2gDzHFwCGzOqzGivTLYto0uEAKR', // vqthanh2
        '2gE09iWSfjeKzAOyQWPs1cnDokA', // vqthanh10
    ];

    private currentKeyIndex: number = 0;

    private getNextApiKey(): string {
        const apiKey = this.apiKeys[this.currentKeyIndex];
        this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
        // console.log('apiKey:', apiKey);
        return apiKey;
    }

    async getTopTokenHolders(chainId: number, contractAddress: string, page: number): Promise<ChainbaseM> {
        try {
            const endPoint = `${this.baseUrl}/token/top-holders?chain_id=${chainId}&contract_address=${contractAddress}&page=${page}&limit=100`;
            const response = await axios.get(endPoint, {
                headers: {
                    'x-api-key': this.getNextApiKey(),
                },
            });



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