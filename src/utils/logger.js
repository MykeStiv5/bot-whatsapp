const fs = require('fs');
const path = require('path');

const logDir = path.resolve(__dirname, '../../storage/logs');

function ensureLogDir() {

  if (!fs.existsSync(logDir)) {

    fs.mkdirSync(logDir, {
      recursive: true
    });
  }
}

function write(level, message) {

  ensureLogDir();

  const log =
    `[${new Date().toISOString()}] [${level}] ${message}`;

  console.log(log);

  const fileName =
    `${new Date().toISOString().slice(0,10)}.log`;

  fs.appendFileSync(
    path.join(logDir, fileName),
    log + '\n'
  );
}

module.exports = {
  info: (msg) => write('INFO', msg),
  warn: (msg) => write('WARN', msg),
  error: (msg) => write('ERROR', msg)
};
