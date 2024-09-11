import TeleBot from "telebot"
import { database, ref, get } from './config';

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN)

bot.on(['/rep'], (msg) => {
    const chatId = msg.chat.id;

    return bot.sendMessage(chatId, `фф`);
});

export default bot