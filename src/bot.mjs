import TeleBot from 'telebot';
import { database, ref, get, update } from './config.mjs';

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

const actionKeyboard = bot.keyboard([
    ['+aura', '-aura']
], { resize: true });

const userKeyboard = async () => {
    const usersRef = ref(database, 'user');
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
        const data = snapshot.val();
        const buttons = Object.keys(data).map(user => [user]);
        return bot.keyboard(buttons, { resize: true });
    }
    return bot.keyboard([]);
};

const modifyKeyboard = bot.keyboard([
    ['Прибавить', 'Отнять']
], { resize: true });

// Храним состояние бота для каждого чата
const chatState = {};

bot.on('aura', async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text.trim().toLowerCase();
    const userId = msg.from.id;

    if (!chatState[chatId]) {
        chatState[chatId] = { step: null, user: null };
    }

    const state = chatState[chatId];

    if (state.step === null) {
        if (messageText === '+aura' || messageText === '-aura') {
            state.step = 'selectUser';
            return bot.sendMessage(chatId, 'Выберите пользователя:', { replyMarkup: await userKeyboard() });
        }
    } else if (state.step === 'selectUser') {
        const usersRef = ref(database, 'user');
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            if (data[messageText]) {
                state.user = messageText;
                state.step = 'selectAction';
                return bot.sendMessage(chatId, 'Выберите действие:', { replyMarkup: modifyKeyboard });
            }
        }
    } else if (state.step === 'selectAction') {
        if (messageText === 'прибавить' || messageText === 'отнять') {
            state.step = 'modifyAura';
            state.action = messageText;
            return bot.sendMessage(chatId, `Введите количество для ${messageText === 'прибавить' ? 'добавления' : 'убавления'}:`);
        }
    } else if (state.step === 'modifyAura') {
        const amount = parseInt(messageText, 10);
        if (!isNaN(amount)) {
            const user = state.user;
            const usersRef = ref(database, `user/${user}`);
            const snapshot = await get(usersRef);

            if (snapshot.exists()) {
                const data = snapshot.val();
                const newAura = data.aura + (state.action === 'прибавить' ? amount : -amount);

                await update(usersRef, { aura: newAura });

                bot.sendMessage(chatId, `Aura ${state.action === 'прибавить' ? 'добавлена' : 'убавлена'} на ${amount}.`);
                state.step = null;
                state.user = null;
                state.action = null;
            }
        } else {
            bot.sendMessage(chatId, 'Введите корректное количество.');
        }
    }
});

export default bot;
