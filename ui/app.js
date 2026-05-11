window.addEventListener('DOMContentLoaded', () => {

  const startButton = document.getElementById('refreshBtn');
  const qrImage = document.getElementById('qrImage');
  const statusText = document.getElementById('statusText');
  const processStatus = document.getElementById('processStatus');
  const activityList = document.getElementById('activityList');
  const manualForm = document.getElementById('manualForm');

  function addActivity(text, type = 'info') {

    if (!activityList) return;

    const div = document.createElement('div');

    div.classList.add('activity-item', type);

    div.innerHTML = `
      <p>${text}</p>
      <span>${new Date().toLocaleTimeString()}</span>
    `;

    activityList.prepend(div);
  }

  /*
  ============================
  START BOT
  ============================
  */

  if (startButton) {

    startButton.addEventListener('click', async () => {

      addActivity('Iniciando bot...');

      processStatus.innerHTML = 'Conectando...';

      await window.electronAPI.startBot();
    });
  }

  /*
  ============================
  QR
  ============================
  */

  window.electronAPI.onQRCode((qr) => {

    qrImage.src = qr;
    qrImage.style.display = 'block';

    addActivity('QR generado');
  });

  /*
  ============================
  STATUS
  ============================
  */

  window.electronAPI.onStatus((status) => {

    statusText.innerHTML = status;
    processStatus.innerHTML = status;

    addActivity(status);
  });

  /*
  ============================
  LOGS
  ============================
  */

  window.electronAPI.onLog((log) => {

    addActivity(log);
  });

  /*
  ============================
  FORM MANUAL (OPCIONAL)
  ============================
  */

  if (manualForm) {

    manualForm.addEventListener('submit', async (e) => {

      e.preventDefault();

      const title = document.getElementById('title').value;
      const link = document.getElementById('link').value;
      const description = document.getElementById('description').value;

     await window.electronAPI.sendMessage({
        number: "3043409743",
        text: `📰 ${title}

          🔗 ${link}

         📝 ${description}`
      });

      addActivity('Mensaje manual enviado', 'success');

      manualForm.reset();
    });
  }

  addActivity('Interfaz iniciada');
});