require('dotenv').config();

module.exports = {
  RSS_URL: process.env.RSS_URL,
  DEST_NUMBER: process.env.DEST_NUMBER,
  CHECK_INTERVAL: process.env.CHECK_INTERVAL
};
