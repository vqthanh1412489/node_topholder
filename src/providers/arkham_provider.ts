import { ArkhamAddressInfoM } from '../models';
import { SHA256 } from 'crypto-js';
import axios from 'axios';


function createSha256Hash(inputData: string): string {
    const hash = SHA256(inputData).toString();
    return hash;
}

export class ArrkhamProvider {
    static readonly apiKey = 'gh67j345kl6hj5k432';
    static readonly apiHost = 'https://api.arkhamintelligence.com';

    static async getAddressLabel(address: string): Promise<ArkhamAddressInfoM> {
        try {
            const apiUrl = `${ArrkhamProvider.apiHost}/intelligence/address/${address}`;
            const xTimestamp = Math.floor(Date.now() / 1000).toString();
            const newDict = apiUrl.replace(ArrkhamProvider.apiHost, '').split('?')[0];
            const dummy = `${newDict}:${xTimestamp}:${ArrkhamProvider.apiKey}`;
            const dummyHash = createSha256Hash(dummy);
            const payloadRaw = `${ArrkhamProvider.apiKey}:${dummyHash}`;
            const xPayloadResult = createSha256Hash(payloadRaw);

            const headers = {
                'Origin': 'https://platform.arkhamintelligence.com',
                'Referer': 'https://platform.arkhamintelligence.com/',
                'X-Payload': xPayloadResult,
                'X-Timestamp': xTimestamp,
            };

            const response = await axios.get<ArkhamAddressInfoM>(apiUrl, { headers });
            // console.log(`response: ${JSON.stringify(response.data)}`);

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error('Failed to load address info');
            }
        } catch (e) {
            console.log(`Error: ${e.toString()}`);
            throw new Error('Failed to load address info');
        }
    }
    static async getNumberOfTransactions(address: string): Promise<number> {
        try {
            const apiUrl = `${ArrkhamProvider.apiHost}/transfers?base=${address}&timeLast=1w`;
            const xTimestamp = Math.floor(Date.now() / 1000).toString();
            const newDict = apiUrl.replace(ArrkhamProvider.apiHost, '').split('?')[0];
            const dummy = `${newDict}:${xTimestamp}:${ArrkhamProvider.apiKey}`;
            const dummyHash = createSha256Hash(dummy);
            const payloadRaw = `${ArrkhamProvider.apiKey}:${dummyHash}`;
            const xPayloadResult = createSha256Hash(payloadRaw);

            const headers = {
                'Origin': 'https://platform.arkhamintelligence.com',
                'Referer': 'https://platform.arkhamintelligence.com/',
                'X-Payload': xPayloadResult,
                'X-Timestamp': xTimestamp,
            };

            const response = await axios.get<number>(apiUrl, { headers });
            // console.log(`response: ${JSON.stringify(response.data)}`);

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error('Failed to load address info');
            }
        } catch (e) {
            console.log(`Error: ${e.toString()}`);
            throw new Error('Failed to load address info');
        }
    }
}
