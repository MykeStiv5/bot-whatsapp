const { getFeed, formatMessage } = require("./rssService");
const { sendMessage } = require("./whatsappService");

let isRunning = false;
let lastSentId = null;

const TARGET_NUMBER = "3043409743";

/*
====================================
START SCRAPER (SOLO ÚLTIMO ITEM)
====================================
*/
function startScraper(mainWindow) {

  if (isRunning) return;
  isRunning = true;

  console.log("🟢 Scraper iniciado (modo último item)");

  setInterval(async () => {

    try {

      const items = await getFeed();

      if (!items || items.length === 0) return;

      // 🔥 TOMAR SOLO EL MÁS RECIENTE
      const latest = items[0];

      const id = latest.guid || latest.id || latest.link;

      // 🔥 EVITAR REPETIR EL MISMO
      if (id === lastSentId) return;

      lastSentId = id;

      const message = formatMessage(latest);

      mainWindow.webContents.send(
        "bot-log",
        `🆕 Última publicación: ${latest.title}`
      );

      const result = await sendMessage(TARGET_NUMBER, message);

      if (result.success) {

        mainWindow.webContents.send(
          "bot-status",
          "Último mensaje enviado"
        );

        mainWindow.webContents.send(
          "bot-log",
          "Enviado correctamente"
        );

      } else {

        mainWindow.webContents.send(
          "bot-log",
          "Error envío: " + result.error
        );
      }

    } catch (err) {

      console.error("Scraper error:", err.message);
    }

  }, 20000); // cada 20s
}

module.exports = {
  startScraper
};