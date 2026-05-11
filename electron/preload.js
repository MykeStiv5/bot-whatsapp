const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {

  // BOT CONTROL
  startBot: () => ipcRenderer.invoke("start-bot"),
  restartBot: () => ipcRenderer.invoke("restart-bot"),

  // SEND MESSAGE (MANUAL)
  sendMessage: (data) => ipcRenderer.invoke("send-message", data),

  // EVENTS WHATSAPP
  onQRCode: (callback) => {
    ipcRenderer.removeAllListeners("qr-code");
    ipcRenderer.on("qr-code", (_, data) => callback(data));
  },

  onStatus: (callback) => {
    ipcRenderer.removeAllListeners("bot-status");
    ipcRenderer.on("bot-status", (_, data) => callback(data));
  },

  onLog: (callback) => {
    ipcRenderer.removeAllListeners("bot-log");
    ipcRenderer.on("bot-log", (_, data) => callback(data));
  }
});