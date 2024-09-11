import TeleBot from 'telebot';
import { database, ref, get } from './config.mjs';

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

// Создаем клавиатуру с двумя кнопками
const keyboard = bot.keyboard([
    ['/aura +aura', '/aura -aura']
], { resize: true });

bot.on('aura', async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text.trim().toLowerCase();

    if (messageText === 'aura') {
        const usersRef = ref(database, 'user');
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            let response = 'Количество aura:\n';

            for (const [user, info] of Object.entries(data)) {
                response += `${user}: ${info.aura}\n`;
            }

            return bot.sendMessage(chatId, response, { replyMarkup: keyboard });
        }
    }
});

export default bot;
