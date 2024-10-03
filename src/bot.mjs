import TeleBot from 'telebot';

const bot = new TeleBot('7091205404:AAEOaq8XrCWe3AlNFN4T2kEweeQoX_6h0j4'); // Замените на токен вашего бота

let lastMessages = [];
let lastPayments = [];
let sum = 0, exchangeRate = 0, bought = 0, checksNum = 0;

bot.on('text', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/startwork') {
        sum = 0; exchangeRate = 0; bought = 0;
        await bot.sendMessage(chatId, `Total Cash: ${sum} RUB | 0 USDT\nSend is back: ${bought} USDT\nExchange rate: ${exchangeRate} RUB`);
    } else if (text.startsWith('/Exchangerate ')) {
        exchangeRate = parseFloat(text.split(' ')[1]);
        await bot.sendMessage(chatId, `Total Cash: ${sum} RUB | ${(sum / exchangeRate).toFixed(2)} USDT\nSend is back: ${bought} USDT\nExchange rate: ${exchangeRate} RUB`);
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
            `Total Cash: ${sum.toFixed(2)} RUB | ${(sum / exchangeRate).toFixed(2)} USDT\n` +
            `Send is back: ${bought} USDT\n` +
            `Exchange rate: ${exchangeRate} RUB\n` +
            `------------------------------\n` +
            `Last checks (5):\n${lastMessagesText}\n` +
            `------------------------------\n` +
            `Last Payments:\n${lastPaymentsText}\n` +
            `------------------------------\n` +
            `Total checks number: ${checksNum}\n`);
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
            `Total Cash: ${sum.toFixed(2)} RUB | ${(sum / exchangeRate).toFixed(2)} USDT\n` +
            `Send is back: ${bought} USDT\n` +
            `Exchange rate: ${exchangeRate} RUB\n` +
            `------------------------------\n` +
            `Last checks (5):\n${lastMessagesText}\n` +
            `------------------------------\n` +
            `Last Payments:\n${lastPaymentsText}\n` +
            `------------------------------\n` +
            `Total checks number: ${checksNum}\n`);
    } else if (text.startsWith('/Payments ')) {
        const payment = parseFloat(text.split(' ')[1]);
        bought += payment;
        lastPayments.push(`${new Date().toLocaleTimeString()} ${payment} USDT`);

        const lastMessagesText = lastMessages.join('\n');
        const lastPaymentsText = lastPayments.join('\n');

        await bot.sendMessage(chatId, `${String.fromCharCode(0x2705)} UPDATE ${String.fromCharCode(0x2705)}\n` +
            `------------------------------\n` +
            `Total Cash: ${sum.toFixed(2)} RUB | ${(sum / exchangeRate).toFixed(2)} USDT\n` +
            `Send is back: ${bought.toFixed(2)} USDT\n` +
            `Exchange rate: ${exchangeRate} RUB\n` +
            `------------------------------\n` +
            `Last checks (5):\n${lastMessagesText}\n` +
            `------------------------------\n` +
            `Last Payments:\n${lastPaymentsText}\n` +
            `------------------------------\n` +
            `Total checks number: ${checksNum}\n`);
    }
});

export default bot;
