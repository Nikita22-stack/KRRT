import TeleBot from 'telebot';
import { database, ref, get, update } from './config.mjs';

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

const createButtons = () => {
    return [
        [
            { text: 'Вадим', callback_data: 'select_user_Вадим' },
            { text: 'Никита', callback_data: 'select_user_Никита' },
            { text: 'Ярик', callback_data: 'select_user_Ярик' }
        ]
    ];
};

// Обрабатываем текстовые сообщения
bot.on('text', async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text.trim();

    // Проверяем, содержит ли сообщение слово '+aura'
    if (messageText.toLowerCase() === '+aura') {
        // Создаем ссылку на все данные в узле 'user'
        const usersRef = ref(database, 'user');
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            // Отправляем сообщение с кнопками
            return bot.sendMessage(chatId, 'Выберите пользователя для изменения aura:', {
                reply_markup: {
                    inline_keyboard: createButtons()
                }
            });
        }
    }
});

// Обрабатываем нажатия на кнопки
bot.on('callbackQuery', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data.split('_');
    const action = data[0];
    const userName = data[2];

    if (action === 'select_user') {
        // Сохраняем выбранного пользователя для последующего использования
        bot.sendMessage(chatId, `Вы выбрали ${userName}. Пожалуйста, введите количество, которое нужно прибавить или убавить. Пример: +5 или -3`);

        // Сохраняем данные о текущем пользователе для дальнейшего использования
        bot.on('text', async (msg) => {
            const inputText = msg.text.trim();
            const amount = parseInt(inputText, 10);

            if (!isNaN(amount) && (amount !== 0)) {
                const userRef = ref(database, `user/${userName}`);
                const snapshot = await get(userRef);

                if (snapshot.exists()) {
                    const user = snapshot.val();
                    const newAura = user.aura + amount; // Прибавляем или убавляем количество aura

                    // Обновляем значение aura в базе данных
                    await update(userRef, { aura: newAura });

                    // Отправляем подтверждение пользователю
                    return bot.sendMessage(chatId, `Количество aura для ${userName} обновлено до ${newAura}`);
                }
            } else {
                return bot.sendMessage(chatId, 'Пожалуйста, введите корректное число для изменения aura.');
            }
        });
    }
});

export default bot;
