import TeleBot from "telebot"

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN)

bot.on('/rep', (msg) => {
    const chatId = msg.chat.id; // Идентификатор чата, из которого пришло сообщение
    bot.sendMessage(chatId, 'Привет!');
});

bot.start();
