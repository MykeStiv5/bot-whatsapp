const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");

let client = null;
let isReady = false;

/*
========================
CONECTAR WHATSAPP
========================
*/
async function connectWhatsApp(mainWindow) {

  return new Promise((resolve, reject) => {

    client = new Client({
      authStrategy: new LocalAuth({
        dataPath: "./session"
      }),
      puppeteer: {
        headless: false,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
      }
    });

    /*
    QR DIRECTO A TU APP
    */
    client.on("qr", async (qr) => {

      const qrImage = await qrcode.toDataURL(qr);

      mainWindow.webContents.send("qr-code", qrImage);
      mainWindow.webContents.send("bot-status", "Escanea el QR");
    });

    /*
    READY
    */
    client.on("ready", () => {

      isReady = true;

      mainWindow.webContents.send("bot-status", "WhatsApp conectado");
      mainWindow.webContents.send("bot-log", "Sistema listo");

      resolve(true);
    });

    client.on("auth_failure", (msg) => {
      isReady = false;
      reject(msg);
    });

    client.on("disconnected", () => {
      isReady = false;
    });

    client.initialize();
  });
}

/*
========================
ENVIAR MENSAJE REAL
========================
*/
async function sendMessage(number, text) {

  if (!client || !isReady) {
    return { success: false, error: "WhatsApp no listo" };
  }

  try {

    let clean = number.toString().replace(/\D/g, "");

    if (!clean.startsWith("57")) {
      clean = "57" + clean;
    }

    const chatId = `${clean}@c.us`;

    await client.sendMessage(chatId, text);

    return { success: true };

  } catch (err) {

    return { success: false, error: err.message };
  }
}

module.exports = {
  connectWhatsApp,
  sendMessage
};