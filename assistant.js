const AssistantV2 = require("ibm-watson/assistant/v2");
const { IamAuthenticator } = require("ibm-watson/auth");
const keys = require("./keys");
var sessionID = null;

// Autenticação do Assistant no IBM Cloud
const assistant = new AssistantV2({
  version: "2019-02-28",
  authenticator: new IamAuthenticator({
    apikey: keys.apikey
  }),
  url: keys.apiurl
});

// Cria nova sessão de usuário no Watson Assistant
function createSession() {
  return new Promise((resolve, reject) => {
    assistant
      .createSession({
        assistantId: keys.assistantID
      })
      .then(res => {
        sessionID = res.result.session_id;
        console.log("Watson Assistant Session ID:\n" + sessionID);

        resolve(sessionID);
      });
  });
}

// Handler de IO do Watson Assistant
function watsonIO(userText, sessionID) {
  if (userText == "/start") userText = "";
  // if (userText == "/end") userTest = "Tchau";
  console.log("Entrada do usuário Watson Assistant:\n" + userText + "\n");
  return new Promise((resolve, reject) => {
    assistant
      .message({
        assistantId: keys.assistantID,
        sessionId: sessionID,
        input: {
          message_type: "text",
          text: userText
        }
      })
      .then(res => {
        let out = res.result.output.generic;
        console.log("Saida(s) do Watson Assistant:");
        let messages = out.map(resp => {
          console.log(resp.text);
          return resp.text;
        });
        console.log("\n");
        resolve(messages);
      })
      .catch(err => {
        console.log(err);
      });
  });
}

module.exports = {
  createSession: createSession,
  watsonIO: watsonIO,
  sessionID
};
