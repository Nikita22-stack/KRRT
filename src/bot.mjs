import TeleBot from 'telebot';
import { database, ref, get } from './config'; // убедитесь, что вы правильно настроили Firebase

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

bot.on('/rep', async (msg) => {
    const chatId = msg.chat.id;
    const repRef = ref(database, 'user/waik/rep'); // путь к вашему узлу в Firebase

    const snapshot = await get(repRef);
    if (snapshot.exists()) {
        const repValue = snapshot.val();
        return bot.sendMessage(chatId, `Текущее значение rep: ${repValue}`);
    }
});

export default bot;
