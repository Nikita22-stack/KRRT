import TeleBot from 'telebot';
import { database, ref, get, update } from './config.mjs';

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

// Обрабатываем текстовые сообщения
bot.on('text', async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text.trim().toLowerCase();

    // Проверяем, содержит ли сообщение слово 'aura'
    if (messageText === 'aura') {
        const keyboard = bot.keyboard([
            ['+aura', '-aura']
        ], { resize: true });

        return bot.sendMessage(chatId, 'Выберите действие:', { replyMarkup: keyboard });
    }
});

// Обрабатываем нажатия кнопок
bot.on('callbackQuery', async (msg) => {
    const chatId = msg.message.chat.id;
    const data = msg.data;

    if (data === '+aura' || data === '-aura') {
        // Создаем клавиатуру для выбора пользователя
        const keyboard = bot.keyboard([
            ['Вадим', 'Никита', 'Ярик']
        ], { resize: true });

        return bot.sendMessage(chatId, `Выберите пользователя для ${data === '+aura' ? 'добавления' : 'убавления'} aura:`, { replyMarkup: keyboard });
    }

    // Обрабатываем выбор пользователя
    const user = data;
    const users = ['Вадим', 'Никита', 'Ярик'];
    
    if (users.includes(user)) {
        const userRef = ref(database, `user/${user}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const info = snapshot.val();
            const newAura = data === '+aura' ? (info.aura || 0) + 1 : (info.aura || 0) - 1;

            // Обновляем значение aura в базе данных
            await update(userRef, { aura: newAura });

            return bot.sendMessage(chatId, `${user} теперь имеет ${newAura} aura.`);
        }
    }
});

// Запускаем бота
bot.start();
