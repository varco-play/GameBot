const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againgOptions } = require("./options");

//your token from botfather
const token = "6519720346:AAHXoMKA-8McJ5EGTaNGrVml9kXalqFR6ik";

const bot = new TelegramApi(token, { polling: true });
const Img =
  "https://avatars.dzeninfra.ru/get-zen_doc/9709627/pub_643de9cf29c49271b1738d4a_643df147b4206372d496dca5/scale_1200";
const Message = ({ id, msg, callBack }) => {
  return bot.sendMessage(id, msg, callBack);
};
const Sticker = async ({ id, sticker }) => {
  await bot.sendSticker(id, sticker);
};
const Image = ({ id, img }) => {
  bot.sendPhoto(id, img);
};


const Stickers = {
  welcome:
    "https://tlgrm.ru/_/stickers/d06/e20/d06e2057-5c13-324d-b94f-9b5a0e64f2da/11.webp",
  guess:
    "https://a127fb2c-de1c-4ae0-af0d-3808559ec217.selcdn.net/stickers/463/343/46334338-7539-4dae-bfb6-29e0bb04dc2d/192/7.webp",
  info: "https://a127fb2c-de1c-4ae0-af0d-3808559ec217.selcdn.net/stickers/463/343/46334338-7539-4dae-bfb6-29e0bb04dc2d/192/9.webp",
  right:
    "https://a127fb2c-de1c-4ae0-af0d-3808559ec217.selcdn.net/stickers/463/343/46334338-7539-4dae-bfb6-29e0bb04dc2d/192/5.webp",
  wrong:
    "https://a127fb2c-de1c-4ae0-af0d-3808559ec217.selcdn.net/stickers/463/343/46334338-7539-4dae-bfb6-29e0bb04dc2d/192/4.webp",
};

const chats = {};

const startGame = async (chatId) => {
  await Message({
    id: chatId,
    msg: "I will create a random number from 0 to 9 and you should guess it",
  });

  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await Sticker({ id: chatId, sticker: Stickers.guess });
  setTimeout(() => {
    return Message({
      id: chatId,
      msg: `OK, I created, now guess the number`,
      callBack: gameOptions,
    });
  }, 2200);
};

bot.setMyCommands([
  { command: "/start", description: "Start bot" },
  { command: "/info", description: "Get info about user" },
  { command: "/game", description: "Guess the number" },
]);

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const user = msg.chat.first_name;
    const nickName = msg.chat.username;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await Sticker({ id: chatId, sticker: Stickers.welcome });
      return Message({
        id: chatId,
        msg: `Hello ${user} welcome to this awesome telegram bot which made by Sarvar, our Senior programmer :)`,
      });
    }
    if (text === "/info") {
      return (
        await Message({
          id: chatId,
          msg: `I have a few data about you, first your name is ${user} and your nickname is ${nickName}`,
        }),
        Sticker({ id: chatId, sticker: Stickers.info })
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }

    return Message({
      id: chatId,
      msg: "I don't understand you pls recheck the command",
    });
  });

  bot.on("callback_query", async (msg) => {
    const chatId = msg.message.chat.id;
    const data = msg.data;
    if (data === "/game") {
      return startGame(chatId);
    }
    if (data == chats[chatId]) {
      await Sticker({ id: chatId, sticker: Stickers.right });
      return Message({
        id: chatId,
        msg: `Right, Well Done, number was ${chats[chatId]}`,
        callBack: againgOptions,
      });
    } else {
      await Sticker({ id: chatId, sticker: Stickers.wrong });
      return Message({
        id: chatId,
        msg: `No, the number was ${chats[chatId]}`,
        callBack: againgOptions,
      });
    }
  });
};

start();
