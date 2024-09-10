import TeleBot from "telebot"

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN)

bot.on(['/start'], (msg) => {
    const chatId = msg.from.id;
    const username = msg.from.first_name;

    // Создаем клавиатуру с одной кнопкой для web_app
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

    // Отправляем сообщение с клавиатурой и никнеймом пользователя
    return bot.sendMessage(
        chatId,
        `Привет, ${username}! Прикоснись к воде. 💦`,
        { replyMarkup: keyboard }
    );
});

export default bot

/*
const { Telegraf } = require('telegraf');
const admin = require('firebase-admin');

// Инициализация Firebase
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://your-database-name.firebaseio.com',
});

const db = admin.database();

const bot = new Telegraf('YOUR_TELEGRAM_BOT_TOKEN');

bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const userName = ctx.from.username;
  const userRef = db.ref(`users/${userId}`);
  
  // Проверяем, есть ли уже пользователь в базе данных
  const snapshot = await userRef.once('value');
  if (!snapshot.exists()) {
    // Если пользователя нет, создаем новую запись
    userRef.set({
      username: userName,
      points: 0,
      energy: 6500
    });
  }
  
  ctx.reply(`Welcome, ${ctx.from.first_name}!`);
});

bot.launch();
*/