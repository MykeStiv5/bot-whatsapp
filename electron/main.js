const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const { connectWhatsApp, sendMessage } = require("../src/services/whatsappService");
const { startScraper } = require("../src/services/scraperEngine");

let mainWindow = null;
let botReady = false;
let scraperStarted = false;

function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadURL("http://localhost:3000");
}

/*
========================
INICIAR BOT
========================
*/
ipcMain.handle("start-bot", async () => {

  try {

    if (!botReady) {

      botReady = await connectWhatsApp(mainWindow);
    }

    if (!scraperStarted) {
      startScraper(mainWindow);
      scraperStarted = true;
    }

    mainWindow.webContents.send("bot-log", "🚀 Bot iniciado");

    return { success: true };

  } catch (err) {

    return { success: false, error: err.message };
  }
});

/*
========================
🔥 ENVÍO MANUAL (ESTO ES LO CLAVE)
========================
*/
ipcMain.handle("send-message", async (_, data) => {

  try {

    const { number, text } = data;

    if (!botInstance) {
      return { success: false, error: "Bot no iniciado" };
    }

    const result = await sendMessage(number, text);

    mainWindow.webContents.send(
      "bot-log",
      result.success
        ? "📩 Manual enviado OK"
        : "❌ Error manual: " + result.error
    );

    return result;

  } catch (err) {

    return { success: false, error: err.message };
  }
});
/*
====================================
MENSAJE MANUAL (DESDE SERVER)
====================================
*/
ipcMain.on("manual-send", async (_, data) => {

  try {

    const { number, text } = data;

    if (!botInstance) {
      mainWindow.webContents.send("bot-log", "❌ Bot no listo");
      return;
    }

    const result = await sendMessage(number, text);

    mainWindow.webContents.send(
      "bot-log",
      result.success
        ? "📩 Mensaje manual enviado"
        : "❌ Error manual: " + result.error
    );

  } catch (err) {

    mainWindow.webContents.send(
      "bot-log",
      "❌ Error manual: " + err.message
    );
  }
});


app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});