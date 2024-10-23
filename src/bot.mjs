import TeleBot from 'telebot';

const bot = new TeleBot('7343134073:AAGDOTaMuL9nBkJsKukiKcRTfbt2_2joa_g'); // Замените на токен вашего бота

let lastMessages = [];
let lastPayments = [];
let sum = 0, exchangeRate = 0, bought = 0, checksNum = 0;

bot.on('text', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/更新') {
        sum = 0; exchangeRate = 0; bought = 0;
        await bot.sendMessage(chatId, `总计: ${sum} RUB | 0 USDT\n发送返回: ${bought} USDT\n汇率: ${exchangeRate} RUB`);
    } else if (text.startsWith('/交换')) {
        exchangeRate = parseFloat(text.split(' ')[1]);
        await bot.sendMessage(chatId, `总计: ${sum} RUB | ${(sum / exchangeRate).toFixed(2)} USDT\n发送返回: ${bought} USDT\n汇率: ${exchangeRate} RUB`);
    } else if (text.startsWith('+')) {
        const amount = parseFloat(text.substring(1));
        lastMessages.push(`${new Date().toLocaleTimeString()} ${amount}`);

        if (lastMessages.length > 5) {
            lastMessages.shift();
        }

        sum += amount;
        checksNum++;

        const lastMessagesText = lastMessages.join('\n');
        const lastPaymentsText = lastPayments.join('\n');

        await bot.sendMessage(chatId, `${String.fromCharCode(0x2705)} UPDATE ${String.fromCharCode(0x2705)}\n` +
            `------------------------------\n` +
            `总计: ${sum.toFixed(2)} RUB | ${(sum / exchangeRate).toFixed(2)} USDT\n` +
            `发送返回: ${bought} USDT\n` +
            `汇率: ${exchangeRate} RUB\n` +
            `------------------------------\n` +
            `最近5笔交易:\n${lastMessagesText}\n` +
            `------------------------------\n` +
            `最后一次付款:\n${lastPaymentsText}\n` +
            `------------------------------\n` +
            `支票总数: ${checksNum}\n`);
    } else if (text.startsWith('-')) {
        const amount = parseFloat(text.substring(1));
        lastMessages.push(`${new Date().toLocaleTimeString()} -${amount}`);

        if (lastMessages.length > 5) {
            lastMessages.shift();
        }

        sum -= amount;
        checksNum--;

        const lastMessagesText = lastMessages.join('\n');
        const lastPaymentsText = lastPayments.join('\n');

        await bot.sendMessage(chatId, `${String.fromCharCode(0x2705)} UPDATE ${String.fromCharCode(0x2705)}\n` +
            `------------------------------\n` +
            `总计: ${sum.toFixed(2)} RUB | ${(sum / exchangeRate).toFixed(2)} USDT\n` +
            `发送返回: ${bought} USDT\n` +
            `汇率: ${exchangeRate} RUB\n` +
            `------------------------------\n` +
            `最近5笔交易:\n${lastMessagesText}\n` +
            `------------------------------\n` +
            `最后一次付款:\n${lastPaymentsText}\n` +
            `------------------------------\n` +
            `支票总数: ${checksNum}\n`);
    } else if (text.startsWith('/付款')) {
        const payment = parseFloat(text.split(' ')[1]);
        bought += payment;
        lastPayments.push(`${new Date().toLocaleTimeString()} ${payment} USDT`);

        const lastMessagesText = lastMessages.join('\n');
        const lastPaymentsText = lastPayments.join('\n');

        await bot.sendMessage(chatId, `${String.fromCharCode(0x2705)} UPDATE ${String.fromCharCode(0x2705)}\n` +
            `------------------------------\n` +
            `总计: ${sum.toFixed(2)} RUB | ${(sum / exchangeRate).toFixed(2)} USDT\n` +
            `发送返回: ${bought.toFixed(2)} USDT\n` +
            `汇率: ${exchangeRate} RUB\n` +
            `------------------------------\n` +
            `最近5笔交易:\n${lastMessagesText}\n` +
            `------------------------------\n` +
            `最后一次付款:\n${lastPaymentsText}\n` +
            `------------------------------\n` +
            `支票总数: ${checksNum}\n`);
    }
});

export default bot;
