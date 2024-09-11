import TeleBot from 'telebot';
import { database, ref, get } from './config.mjs';

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

bot.on('/rep', (msg) => {
    const chatId = msg.chat.id;
    const userRef = ref(database, 'user');

    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            let repMessage = 'Количество rep:\n';

            // Проходим по всем пользователям и добавляем их значения rep в сообщение
            for (const userId in data) {
                if (data[userId].rep) {
                    repMessage += `${userId}: ${data[userId].rep}\n`;
                }
            }

            return bot.sendMessage(chatId, repMessage);
        }
    });
});

export default bot;



/*
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

            // Проходим по всем пользователям и добавляем их значения rep в сообщение
            for (const userId in data) {
                if (data[userId].rep) {
                    repMessage += `${userId}: ${data[userId].rep}\n`;
                }
            }

            return bot.sendMessage(chatId, repMessage);
        }
    });
});

export default bot;








import TeleBot from "telebot"
import { database, ref } from './config';

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN)

bot.on(['/rep'], (msg) => {
    const chatId = msg.chat.id;

    // Отправляем сообщение с клавиатурой и никнеймом пользователя
    return bot.sendMessage(chatId, ``);
});

export default bot
*/