export class TelegramServices {
    private readonly chatId: string = '@max_onchain_noti';
    private readonly botToken: string = '6817564737:AAEZlhmRkHL93iCETOpuZpL0M0uuKVYrxbg';

    // Text of the message to be sent, 1-4096 characters after entities parsing
    // https://core.telegram.org/bots/api#sendmessage
    _limitMessage(message) {
        return message.substring(0, Math.min(4096, message.length));
    }

    async sendMessage(text) {
        const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
        const headers = { 'Content-Type': 'application/json' };
        const body = JSON.stringify({
            chat_id: this.chatId,
            text: this._limitMessage(text),
            parse_mode: 'MarkdownV2',
        });

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body,
        });

        const responseBody = await response.text();

        if (response.status === 200) {
            console.log('Message sent successfully');
            console.log(responseBody);
        } else {
            console.error(`Failed to send message. Status code: ${response.status}`);
            console.error(responseBody);
        }
    }
}