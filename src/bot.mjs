import TeleBot from "telebot"

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN)

bot.on(['/rep'], (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.first_name;

    // Создаем клавиатуру с одной кнопкой для web_app
    const keyboard = {
        inline_keyboard: [
            [
                {
                    text: 'НА',
                    web_app: { url: 'https://watertouch.vercel.app/' }
                }
            ]
        ]
    };

    // Отправляем сообщение с клавиатурой и никнеймом пользователя
    return bot.sendMessage(
        chatId,
        `Привет, ${username}! Прикоснись к воде. 💦`,
        { replyMarkup: keyboard }
    );
});

export default bot