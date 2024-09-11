import TeleBot from 'telebot';
import { database, ref, get } from './config.mjs';

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

// Обрабатываем текстовые сообщения
bot.on('text', async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text.trim();

    // Проверяем, содержит ли сообщение слово 'aura'
    if (messageText.toLowerCase() === 'aura') {
        // Создаем ссылку на все данные в узле 'user'
        const usersRef = ref(database, 'user');
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            let response = 'Количество aura:\n';

            // Проходимся по всем пользователям и добавляем их данные в сообщение
            for (const [user, info] of Object.entries(data)) {
                response += `${user}: ${info.aura}\n`;
            }

            return bot.sendMessage(chatId, response);
        }
    }
});

export default bot;
