import axios from 'axios';

class TelegramServices {
    private static chatId: string = '@max_onchain_noti';
    private static botToken: string = '6817564737:AAEZlhmRkHL93iCETOpuZpL0M0uuKVYrxbg';

    private constructor() { }

    private static instance: TelegramServices = new TelegramServices();
    public static getInstance(): TelegramServices {
        return TelegramServices.instance;
    }

    private limitMessage(message: string): string {
        return message.substring(0, Math.min(4096, message.length));
    }

    public async sendMessage(text: string): Promise<void> {
        const url: string = `https://api.telegram.org/bot${TelegramServices.botToken}/sendMessage`;
        const headers: any = { 'Content-Type': 'application/json' };
        const body: any = {
            chat_id: TelegramServices.chatId,
            text: this.limitMessage(text),
            parse_mode: 'MarkdownV2',
        };

        try {
            const response = await axios.post(url, body, { headers: headers });
            console.log(response.data);

            if (response.status === 200) {
                console.log('Message sent successfully');
            } else {
                console.log(`Failed to send message. Status code: ${response.status}`);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
}
