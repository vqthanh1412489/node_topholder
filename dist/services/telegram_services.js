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
const axios_1 = require("axios");
class TelegramServices {
    constructor() { }
    static getInstance() {
        return TelegramServices.instance;
    }
    limitMessage(message) {
        return message.substring(0, Math.min(4096, message.length));
    }
    sendMessage(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://api.telegram.org/bot${TelegramServices.botToken}/sendMessage`;
            const headers = { 'Content-Type': 'application/json' };
            const body = {
                chat_id: TelegramServices.chatId,
                text: this.limitMessage(text),
                parse_mode: 'MarkdownV2',
            };
            try {
                const response = yield axios_1.default.post(url, body, { headers: headers });
                console.log(response.data);
                if (response.status === 200) {
                    console.log('Message sent successfully');
                }
                else {
                    console.log(`Failed to send message. Status code: ${response.status}`);
                }
            }
            catch (error) {
                console.error('Error sending message:', error);
            }
        });
    }
}
TelegramServices.chatId = '@max_onchain_noti';
TelegramServices.botToken = '6817564737:AAEZlhmRkHL93iCETOpuZpL0M0uuKVYrxbg';
TelegramServices.instance = new TelegramServices();
//# sourceMappingURL=telegram_services.js.map