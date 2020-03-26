const TelegramBot = require(`node-telegram-bot-api`);
const keys = require("./keys");
const assistant = require("./assistant");
const bot = new TelegramBot(keys.telegramToken, { polling: true });

var sessionID = null;

assistant.createSession().then(newSession => {
  sessionID = newSession;
});

// Handler IO Watson Assistant + Telegram
bot.on("message", function(msg) {
  var telegramChatID = msg.chat.id;
  if (msg.text != "") {
    assistant.watsonIO(msg.text, sessionID).then(respostas => {
      for (resposta in respostas) {
        bot.sendMessage(telegramChatID, respostas[resposta]);
      }
    });
  }
});
