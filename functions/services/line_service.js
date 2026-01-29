const axios = require("axios");
const { defineSecret } = require("firebase-functions/params");

const LINE_CHANNEL_TOKEN = defineSecret("LINE_CHANNEL_TOKEN");

async function pushMessage(to, message) {
  return axios.post(
    "https://api.line.me/v2/bot/message/push",
    { to, messages: [message] },
    {
      headers: {
        Authorization: `Bearer ${LINE_CHANNEL_TOKEN.value()}`,
        "Content-Type": "application/json",
      },
    }
  );
}

async function multicastMessage(to, message) {
  return axios.post(
    "https://api.line.me/v2/bot/message/multicast",
    { to, messages: [message] },
    {
      headers: {
        Authorization: `Bearer ${LINE_CHANNEL_TOKEN.value()}`,
        "Content-Type": "application/json",
      },
    }
  );
}

module.exports = {
  LINE_CHANNEL_TOKEN,
  pushMessage,
  multicastMessage,
};
