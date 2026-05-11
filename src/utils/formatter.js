function buildMessage(publication) {

  return `
🚨 Nueva publicación disponible

📌 ${publication.title}

📰 ${publication.summary || 'Nueva actualización'}

🔗 ${publication.link}
  `;
}

module.exports = {
  buildMessage
};
