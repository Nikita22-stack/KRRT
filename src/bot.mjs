import TeleBot from 'telebot';

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

bot.on('/rep', (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.first_name;

    const keyboard = {
        inline_keyboard: [
            [
                {
                    text: 'Открыть приложение',
                    web_app: { url: 'https://watertouch.vercel.app/' }
                }
            ]
        ]
    };

    bot.sendMessage(
        chatId,
        `Привет, ${username}! Прикоснись к воде. 💦`,
        { replyMarkup: keyboard }
    );
});

// Запуск бота
bot.start();