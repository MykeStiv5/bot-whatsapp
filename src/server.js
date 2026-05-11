const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../ui")));

/*
========================
ESTADO
========================
*/
let systemStatus = {
  connected: false,
  qr: null,
  lastExecution: null,
  lastMessage: null
};

/*
========================
STATUS
========================
*/
app.get("/api/status", (req, res) => {
  res.json(systemStatus);
});

/*
========================
QR
========================
*/
app.post("/api/qr", (req, res) => {
  systemStatus.qr = req.body.qr;
  res.json({ ok: true });
});

/*
========================
CONNECTED
========================
*/
app.post("/api/connected", (req, res) => {
  systemStatus.connected = true;
  systemStatus.qr = null;
  res.json({ ok: true });
});

/*
====================================
🔥 ENVÍO MANUAL (FIX FINAL REAL)
====================================
*/
app.post("/api/send", async (req, res) => {

  const { title, link, description } = req.body;

  try {

    const message =
      `📰 ${title}\n\n🔗 ${link}\n\n📝 ${description}`;

    const { BrowserWindow } = require("electron");

    const win = BrowserWindow.getAllWindows()[0];

    if (!win) {
      return res.status(500).json({
        success: false,
        error: "Electron no activo"
      });
    }

    // 🔥 ESTO ES LO IMPORTANTE
    win.webContents.send("manual-send", {
      number: "3043409743",
      text: message
    });

    res.json({ success: true });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});
/*
========================
START SERVER
========================
*/
app.listen(3000, () => {
  console.log("Servidor iniciado");
});