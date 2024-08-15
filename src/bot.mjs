import TeleBot from "telebot"

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN)

bot.on(['/process'], (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.first_name;

    return bot.sendMessage(chatId, `Привет, ${username}!`);
});

export default bot
