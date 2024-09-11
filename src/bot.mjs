import TeleBot from 'telebot';
import { database, ref, get, update } from './config.mjs';

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

// Обрабатываем текстовые сообщения
bot.on('text', async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text.trim();

    // Проверяем, содержит ли сообщение команду '+aura'
    if (messageText.toLowerCase().startsWith('+aura')) {
        const args = messageText.split(' ');

        if (args.length === 3) {
            const userName = args[1];
            const auraToAdd = parseInt(args[2]);

            if (!isNaN(auraToAdd)) {
                const userRef = ref(database, `user/${userName}`);
                const snapshot = await get(userRef);

                if (snapshot.exists()) {
                    const currentAura = snapshot.val().aura || 0;
                    const newAura = currentAura + auraToAdd;

                    // Обновляем значение aura в базе данных
                    await update(userRef, { aura: newAura });

                    return bot.sendMessage(chatId, `${userName} теперь имеет aura: ${newAura}`);
                } else {
                    return bot.sendMessage(chatId, `Пользователь ${userName} не найден.`);
                }
            } else {
                return bot.sendMessage(chatId, 'Пожалуйста, укажите правильное количество aura.');
            }
        } else {
            return bot.sendMessage(chatId, 'Использование: +aura <имя пользователя> <количество>');
        }
    }

    // Проверяем, содержит ли сообщение слово 'aura'
    if (messageText.toLowerCase() === 'aura') {
        const usersRef = ref(database, 'user');
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            let response = 'Количество aura:\n';

            // Проходимся по всем пользователям и добавляем их данные в сообщение
            for (const [user, info] of Object.entries(data)) {
                response += `${user}: ${info.aura || 0}\n`;
            }

            return bot.sendMessage(chatId, response);
        }
    }
});

export default bot;
