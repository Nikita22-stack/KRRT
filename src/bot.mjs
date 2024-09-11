import TeleBot from 'telebot';
import { database, ref, get, update } from './config.mjs';

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

    // Проверяем, начинается ли сообщение с '+aura'
    if (messageText.startsWith('+aura')) {
        const parts = messageText.split(' ');

        if (parts.length === 3) {
            const userName = parts[1];
            const auraToAdd = parseInt(parts[2], 10);

            if (!isNaN(auraToAdd)) {
                const userRef = ref(database, `user/${userName}`);
                const userSnapshot = await get(userRef);

                if (userSnapshot.exists()) {
                    const userData = userSnapshot.val();
                    const updatedAura = userData.aura + auraToAdd;

                    // Обновляем значение 'aura' в базе данных
                    await update(userRef, { aura: updatedAura });

                    return bot.sendMessage(chatId, `${userName} теперь имеет ${updatedAura} aura.`);
                } else {
                    return bot.sendMessage(chatId, `Пользователь ${userName} не найден.`);
                }
            } else {
                return bot.sendMessage(chatId, 'Введите корректное количество aura.');
            }
        } else {
            return bot.sendMessage(chatId, 'Используйте формат: +aura <имя пользователя> <количество>');
        }
    }
});

export default bot;
