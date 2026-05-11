const Parser = require("rss-parser");
const parser = new Parser();

const RSS_URL = "https://rss.app/feeds/2bnwgukClF8bI3BT.xml";

/*
====================================
CACHE GLOBAL (ANTI DUPLICADOS)
====================================
*/

const sentIds = new Set();

/*
====================================
OBTENER FEED
====================================
*/

async function getFeed() {

  try {

    const feed = await parser.parseURL(RSS_URL);

    return feed.items || [];

  } catch (err) {

    console.error("Error RSS:", err.message);
    return [];
  }
}

/*
====================================
FILTRAR SOLO NUEVOS
====================================
*/

function filterNewItems(items) {

  const newItems = [];

  for (const item of items) {

    // 🔥 ID MÁS ESTABLE (mejor que guid solo)
    const id = item.guid || item.id || item.link;

    if (!id) continue;

    if (sentIds.has(id)) continue;

    sentIds.add(id);
    newItems.push(item);
  }

  return newItems;
}

/*
====================================
FORMATEAR MENSAJE WHATSAPP
====================================
*/

function formatMessage(item) {

  return `📰 *${item.title}*

🔗 ${item.link}

📝 ${item.contentSnippet || "Sin descripción"}`;
}

module.exports = {
  getFeed,
  filterNewItems,
  formatMessage
};