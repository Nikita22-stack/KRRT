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
            let response = '🧿 Количество aura 🧿\n\n';

            // Соответствие между именами в БД и хэндлами Telegram
            const userHandles = {
                'Вадим': '@starkoww',
                'Никита': '@MurcieIago7',
                'Ярик': '@qqqqqqq12326'
            };

            // Проходимся по всем пользователям и добавляем их данные в сообщение
            for (const [user, info] of Object.entries(data)) {
                const handle = userHandles[user] || user;
                response += `<a href="tg://user?id=${handle}">${user}</a>: ${info.aura}\n`;
            }

            // Отправляем сообщение с режимом parse_mode: 'HTML' для обработки HTML-тегов
            return bot.sendMessage(chatId, response, { parse_mode: 'HTML' });
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

                    return bot.sendMessage(chatId, `👍 ${userName} теперь имеет ${updatedAura} aura.`);
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

    // Проверяем, начинается ли сообщение с '+aura'
    if (messageText.startsWith('-aura')) {
        const parts = messageText.split(' ');

        if (parts.length === 3) {
            const userName = parts[1];
            const auraToAdd = parseInt(parts[2], 10);

            if (!isNaN(auraToAdd)) {
                const userRef = ref(database, `user/${userName}`);
                const userSnapshot = await get(userRef);

                if (userSnapshot.exists()) {
                    const userData = userSnapshot.val();
                    const updatedAura = userData.aura - auraToAdd;

                    // Обновляем значение 'aura' в базе данных
                    await update(userRef, { aura: updatedAura });

                    return bot.sendMessage(chatId, `🤡 ${userName} теперь имеет ${updatedAura} aura.`);
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

    // Проверяем, содержит ли сообщение слово 'правила'
    if (messageText.toLowerCase() === 'правила') {
        return bot.sendMessage(chatId, `❗ ПРАВИЛА ❗\n
        \n
        Изначально у участников 1000aura\n
        \n
        +aura за заслуги в игре (обсуждаются консилиумом)\n
        \n
        -50aura - оскорбил маму игрока чужой команды\n
        -100aura - оскорбил маму игрока своей команды\n
        -120aura - наныл роль\n
        -150aura - ушел гулять до того как договорились поиграть (ты должен быть всегда готов, чемпион)\n
        -250aura - ушел с женщиной 1vs1 (нужен пруф)\n
        -300aura - ушел гулять после того как договорились\n
        -400aura - ушел хапать\n
        -450aura - лив/руин\n
        -500aura - ушел с другой командой (променял пацанов)\n
        -600aura - ушел в запой\n
        -700aura - загас после договора (участник не выходит на связь)\n
        -жизнь оскорбил маму участников чата команды\n
        \n
        +200 20+ киллов\n
        +250 30+ килов\n
        +350 RAMPAGE\n
        +400 затащил в соло (обсуждается консилиумом)\n
        \n
        aura 0 - бан в команде на 7 дней (с участником не играем) или же 3 дня фулл поз\n
        aura 2000 приветсвенный бонус в виде шоколадки на выбор до 300р (скид остальных участников)\n
        после получения бонуса или разбана аура участника приравнивается к 1000`);
    }

    // Проверяем, содержит ли сообщение слово 'правила'
    if (messageText.toLowerCase() === 'команды') {
        return bot.sendMessage(chatId, `❗ КОМАНДЫ БОТА ❗\n
        aura - кол-во ауры у всех участников\n
        +aura <имя> <количество> - прибавить aura\n
        -aura <имя> <количество> - убавить aura\n
        правила - наши условия`)
    }
});

export default bot;
