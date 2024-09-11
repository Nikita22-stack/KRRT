import TeleBot from 'telebot';
import { database, ref, get, update } from './config.mjs';

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

// Обрабатываем сообщения
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
        return bot.sendMessage(chatId, `❗ ПРАВИЛА ❗
        
Изначально у участников 1000aura

+aura за заслуги в игре (обсуждаются консилиумом)

-50aura - оскорбил маму игрока чужой команды
-100aura - оскорбил маму игрока своей команды
-120aura - наныл роль
-150aura - ушел гулять до того как договорились поиграть (ты должен быть всегда готов, чемпион)
-250aura - ушел с женщиной 1vs1 (нужен пруф)
-300aura - ушел гулять после того как договорились
-400aura - ушел хапать
-450aura - лив/руин
-500aura - ушел с другой командой (променял пацанов)
-600aura - ушел в запой
-700aura - загас после договора (участник не выходит на связь)
-жизнь - оскорбил маму участников чата команды

+200aura - 20+ киллов
+250aura - 30+ килов
+350aura - RAMPAGE
+400aura - затащил в соло (обсуждается консилиумом)

aura 0 - бан в команде на 7 дней (с участником не играем) или же 3 дня фулл поз

aura 2000 - приветсвенный бонус в виде шоколадки на выбор до 300р (скид остальных участников)
после получения бонуса или разбана аура участника приравнивается к 1000`);
    }

    // Проверяем, содержит ли сообщение слово 'команды'
    if (messageText.toLowerCase() === 'команды') {
        return bot.sendMessage(chatId, `📋 КОМАНДЫ 📋

aura - количество ауры у всех участников
+aura <имя> <количество> - прибавить aura
-aura <имя> <количество> - убавить aura
правила - наши условия`)
    }
});

export default bot;
