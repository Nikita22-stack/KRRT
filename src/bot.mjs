import TeleBot from 'telebot';
import { database, ref, get } from './config'; // убедитесь, что вы правильно настроили Firebase

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

bot.on('/rep', async (msg) => {
    const chatId = msg.chat.id;
    const usersRef = ref(database, 'user'); // путь к узлу 'user'

    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
        const data = snapshot.val();
        let repMessage = 'Количество rep для каждого пользователя:\n';

        // Проходим по всем пользователям и добавляем их значения rep в сообщение
        for (const userId in data) {
            if (data[userId].rep) {
                repMessage += `${userId}: ${data[userId].rep}\n`;
            }
        }

        return bot.sendMessage(chatId, repMessage);
    }
});

export default bot;
