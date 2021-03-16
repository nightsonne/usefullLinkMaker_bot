const { Telegraf } = require('telegraf');
require('dotenv').config();
const fetch = require("node-fetch");

const { welcomeMessage } = require('./const');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply(welcomeMessage));

bot.on('text', async (ctx) => {

  let msg = ctx.message.text;

  try {
    const regex = /[0-9]{1,6}/g;
    const testId = msg.match(regex).join('_');
    const date = ctx.message.date + 86400 * 30;
    const url = `https://yandex.ru/ecoo/safe/sign?test-id=${testId}&ttl=86400&ts=${date}`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => res.text())
      .then((data) => {
        let link =
          `RU: https://yandex.ru/ecoo/safe/redirect?key=${data}&to=https://yandex.ru/news ,\n
UA: https://yandex.ua/ecoo/safe/redirect?key=${data}&to=https://yandex.ua/news ,\n
BY: https://yandex.by/ecoo/safe/redirect?key=${data}&to=https://yandex.by/news ,\n
KZ: https://yandex.kz/ecoo/safe/redirect?key=${data}&to=https://yandex.kz/news ,\n
UZ: https://yandex.uz/ecoo/safe/redirect?key=${data}&to=https://yandex.uz/news ,\n
COM: https://yandex.com/ecoo/safe/redirect?key=${data}&to=https://yandex.com/news`;
        ctx.reply(link);
      })
      .catch((err) => {
        ctx.reply(`Простите-извините, что-то пошло не так 😕.\nПопробуйте ввести test-id ещё раз.`);
      });

  } catch {
    ctx.reply(`${ctx.message.from.first_name}, а где test-id?\nЯ не умею делать ссылки без test-id, у меня лапки 😿 `);
  }
});

bot.launch();