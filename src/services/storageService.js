const fs = require('fs');
const path = require('path');

const storagePath = path.resolve(
  __dirname,
  '../../storage/publications.json'
);

function ensureStorage() {

  if (!fs.existsSync(storagePath)) {

    fs.writeFileSync(
      storagePath,
      JSON.stringify([], null, 2)
    );
  }
}

function readPublications() {

  ensureStorage();

  const data =
    fs.readFileSync(storagePath);

  return JSON.parse(data);
}

function publicationExists(id) {

  const publications =
    readPublications();

  return publications.some(
    p => p.id === id
  );
}

function savePublication(publication) {

  const publications =
    readPublications();

  publications.push(publication);

  fs.writeFileSync(
    storagePath,
    JSON.stringify(publications, null, 2)
  );
}

module.exports = {
  ensureStorage,
  readPublications,
  publicationExists,
  savePublication
};
