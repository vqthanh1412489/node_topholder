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
exports.TelegramServices = void 0;
class TelegramServices {
    constructor() {
        this.chatId = '@max_onchain_noti';
        this.botToken = '6817564737:AAEZlhmRkHL93iCETOpuZpL0M0uuKVYrxbg';
    }
    // Text of the message to be sent, 1-4096 characters after entities parsing
    // https://core.telegram.org/bots/api#sendmessage
    _limitMessage(message) {
        return message.substring(0, Math.min(4096, message.length));
    }
    sendMessage(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
            const headers = { 'Content-Type': 'application/json' };
            const body = JSON.stringify({
                chat_id: this.chatId,
                text: this._limitMessage(text),
                parse_mode: 'MarkdownV2',
            });
            const response = yield fetch(url, {
                method: 'POST',
                headers: headers,
                body: body,
            });
            const responseBody = yield response.text();
            if (response.status === 200) {
                console.log('Message sent successfully');
                console.log(responseBody);
            }
            else {
                console.error(`Failed to send message. Status code: ${response.status}`);
                console.error(responseBody);
            }
        });
    }
}
exports.TelegramServices = TelegramServices;
//# sourceMappingURL=telegram_services.js.map