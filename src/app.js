const startButton = document.getElementById('refreshBtn');
const qrImage = document.getElementById('qrImage');
const statusText = document.getElementById('statusText');
const processStatus = document.getElementById('processStatus');
const rssStatus = document.getElementById('rssStatus');
const sendStatus = document.getElementById('sendStatus');
const activityList = document.getElementById('activityList');
const manualForm = document.getElementById('manualForm');

/*
====================================
ACTIVIDAD
====================================
*/
function addActivity(type, text) {

  if (!activityList) return;

  const div = document.createElement('div');
  div.classList.add('activity-item', type);

  let icon = 'fa-circle-info';

  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-circle-xmark';

  const time = new Date().toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit'
  });

  div.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <p>${text}</p>
    <span>${time}</span>
  `;

  activityList.prepend(div);
}

/*
====================================
INICIAR BOT
====================================
*/
if (startButton) {

  startButton.addEventListener('click', async () => {

    try {

      addActivity('info', 'Iniciando sistema...');

      processStatus.innerHTML = 'Conectando WhatsApp...';
      statusText.innerHTML = 'Iniciando...';

      await window.electronAPI.startBot();

    } catch (err) {

      console.log(err);
      addActivity('error', 'Error iniciando bot');
    }
  });
}

/*
====================================
QR
====================================
*/
window.electronAPI.onQRCode((qr) => {

  if (qrImage) {
    qrImage.src = qr;
    qrImage.style.display = 'block';
  }

  const qrMessage = document.getElementById('qrMessage');
  if (qrMessage) {
    qrMessage.innerHTML = 'Escanea el QR desde WhatsApp';
  }

  processStatus.innerHTML = 'Esperando autenticación';

  addActivity('info', 'QR generado');
});

/*
====================================
STATUS
====================================
*/
window.electronAPI.onStatus((message) => {

  statusText.innerHTML = message;
  processStatus.innerHTML = message;

  if (message.includes('conectado')) {

    if (qrImage) qrImage.style.display = 'none';

    addActivity('success', 'WhatsApp conectado');
  }

  if (message.includes('Mensaje enviado')) {
    sendStatus.innerHTML = 'Mensaje enviado';
    addActivity('success', 'Mensaje enviado');
  }

  if (message.toLowerCase().includes('error')) {
    addActivity('error', message);
  }
});

/*
====================================
LOGS
====================================
*/
window.electronAPI.onLog((message) => {
  addActivity('info', message);
});

/*
====================================
🔥 ENVÍO MANUAL (FIX REAL)
====================================
*/
if (manualForm) {

  manualForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const title = document.getElementById('title')?.value;
    const link = document.getElementById('link')?.value;
    const description = document.getElementById('description')?.value;

    try {

      const result = await window.electronAPI.sendMessage({
        number: "3043409743",
        text: `📰 ${title}\n\n🔗 ${link}\n\n📝 ${description}`
      });

      if (result.success) {

        sendStatus.innerHTML = 'Publicación enviada manual';

        addActivity('success', 'Mensaje manual enviado');

        manualForm.reset();

      } else {

        addActivity('error', result.error || 'Error enviando mensaje');
      }

    } catch (err) {

      console.log(err);
      addActivity('error', 'Error de conexión Electron');
    }
  });
}

/*
====================================
INICIO
====================================
*/
addActivity('info', 'Interfaz iniciada');