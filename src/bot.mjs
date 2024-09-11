import TeleBot from 'telebot';
import { database, ref, get } from './config';

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

bot.on('/rep', (msg) => {
    const chatId = msg.chat.id;
    const userRef = ref(database, 'user');

    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            let repMessage = 'Количество rep:\n';

            return bot.sendMessage(chatId, repMessage);
        }
    });
});

export default bot;
