import TeleBot from "telebot";
import { database, ref, onValue } from './config';

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

bot.on(['/rep'], (msg) => {
    const chatId = msg.chat.id;

    // Создаем ссылку на всех пользователей в базе данных Firebase
    const userRef = ref(database, `users`);

    // Получаем все данные пользователей
    onValue(userRef, (snapshot) => {
        const users = snapshot.val();
        let response = 'Репутация пользователей:\n';

        // Проходим по всем пользователям и собираем информацию о репутации
        for (const key in users) {
            if (users[key].rep !== undefined) {
                response += `Имя: ${key}, Репутация: ${users[key].rep}\n`;
            }
        }

        // Отправляем сообщение с количеством репутаций
        return bot.sendMessage(chatId, response);
    });
});

export default bot;
