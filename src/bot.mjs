import TeleBot from "telebot"

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN)

bot.on(['/rep'], (msg) => {
    const chatId = msg.chat.id; // Изменили на msg.chat.id
    bot.sendMessage(chatId, 'Привет!');
});

bot.start();
export default bot;