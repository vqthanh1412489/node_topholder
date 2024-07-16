import { CovalenthqM } from "../models";

const axios = require('axios');

export class CovalenthqProvider {
    private readonly baseUrl: string = 'https://api.covalenthq.com/v1/';
    // private readonly apiKeys: string[] = ['2e1SXeXTKCmUPGWTmL0bMA0WEeQ', // vqthanh1412489
    //     '2gDyr9wqRbNiT7JZjTriq4vrJKx', // vqthanh1
    //     '2gDzHFwCGzOqzGivTLYto0uEAKR', // vqthanh2
    //     '2gE09iWSfjeKzAOyQWPs1cnDokA', // vqthanh10
    // ];

    async getTopTokenHolders({ chainName, tokenAddress, pageNumber, date }): Promise<CovalenthqM> {
        try {
            const endPoint = `${this.baseUrl}${chainName}/tokens/${tokenAddress}/token_holders_v2/?key=cqt_rQyf3B49dYW74kPfbbGhVtX3VwwW&page-number=${pageNumber}&page-size=100&date=${date}`;
            console.log('endPoint:', endPoint);

            const response = await axios.get(endPoint);
            console.log('response:', response.data);

            if (response.status === 200 && response.data['error'] === false && response.data['data'] !== null) {
                // const data = response.data['data']['items'].map(item => CovalenthqM.fromJson(item));
                return response.data
            }

            throw new Error(`CovalenthqM token/top-holders Error: ${response.data}`);
        } catch (error) {
            console.error(`CovalenthqM token/top-holders Error: ${error}`);
            throw new Error(`CovalenthqM token/top-holders Error: ${error}`);
        }
    }
}