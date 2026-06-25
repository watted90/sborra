//Codice di OWNER-bigtag.js

let handler = async (m, { conn, text, participants }) => {
  try {
    if (!text) return m.reply("Devi scrivere un numero e un messaggio!");

    let args = text.split(" ");
    let count = parseInt(args[0]);
    if (isNaN(count) || count < 1) return m.reply("Il primo argomento deve essere un numero valido!");

    let customMessage = args.slice(1).join(" ").trim();
    if (!customMessage) return m.reply("Devi scrivere un messaggio dopo il numero!");

    let users = participants.map((u) => conn.decodeJid(u.id));

    const sendHidetagMessage = async (message) => {
      await conn.relayMessage(
        m.chat,
        {
          extendedTextMessage: {
            text: message,
            contextInfo: { mentionedJid: users },
          },
        },
        {}
      );
    };

    const maxMessageLength = 200;
    let messageChunks = [];

    while (customMessage.length > maxMessageLength) {
      messageChunks.push(customMessage.slice(0, maxMessageLength));
      customMessage = customMessage.slice(maxMessageLength);
    }
    messageChunks.push(customMessage);

    for (let i = 0; i < count; i++) {
      for (let chunk of messageChunks) {
        await sendHidetagMessage(chunk);
      }
    }

  } catch (e) {
    console.error(e);
  }
};

handler.command = /^(bigtag)$/i;
handler.group = true;
handler.owner = true;
export default handler;
