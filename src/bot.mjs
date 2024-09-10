import TeleBot from "telebot"
import { database, ref, set, update } from './config';

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN)

bot.on(['/rep'], (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.first_name;

    return bot.sendMessage(chatId, `Вадим, ${username}!`);
});

export default bot