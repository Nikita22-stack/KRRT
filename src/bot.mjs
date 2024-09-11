import TeleBot from 'telebot';
import { database, ref, get, update } from './config.mjs';

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

// Создаем клавиатуру для выбора действия +aura или -aura
const actionKeyboard = bot.keyboard([
    ['+aura', '-aura']
], { resize: true });

// Создаем клавиатуру для выбора пользователя
const userKeyboard = async (chatId) => {
    const usersRef = ref(database, 'user');
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
        const data = snapshot.val();
        const buttons = Object.keys(data).map(user => [user]);
        return bot.keyboard(buttons, { resize: true });
    }
    return bot.keyboard([]);
};

// Создаем клавиатуру для добавления или убавления значения aura
const modifyKeyboard = bot.keyboard([
    ['Прибавить', 'Отнять']
], { resize: true });

bot.on('text', async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text.trim().toLowerCase();

    // Обработка команды для показа выбора действия
    if (messageText === '+aura' || messageText === '-aura') {
        return bot.sendMessage(chatId, 'Выберите пользователя:', { replyMarkup: await userKeyboard(chatId) });
    }

    // Обработка выбора пользователя
    const usersRef = ref(database, 'user');
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
        const data = snapshot.val();

        // Проверяем, выбрал ли пользователь пользователя
        if (data[messageText]) {
            return bot.sendMessage(chatId, 'Выберите действие:', { replyMarkup: modifyKeyboard });
        }

        // Проверяем, выбрал ли пользователь действие
        if (messageText === 'прибавить' || messageText === 'отнять') {
            return bot.sendMessage(chatId, `Введите количество для ${messageText === 'прибавить' ? 'добавления' : 'убавления'}:`)
                .then(() => {
                    bot.once('text', async (response) => {
                        const amount = parseInt(response.text.trim(), 10);
                        if (!isNaN(amount)) {
                            const user = msg.text.trim();
                            const newAura = data[user].aura + (messageText === 'прибавить' ? amount : -amount);

                            // Обновляем значение aura в базе данных
                            await update(ref(database, `user/${user}`), { aura: newAura });

                            return bot.sendMessage(chatId, `Aura ${messageText === 'прибавить' ? 'добавлена' : 'убавлена'} на ${amount}.`);
                        } else {
                            return bot.sendMessage(chatId, 'Введите корректное количество.');
                        }
                    });
                });
        }
    }
});

export default bot;
