const { url, password } = require('./constants');
const rpn = require('request-promise-native');
const fs = require('fs');

const docCount = async () => {
  const info = await rpn.get({ json: true, url: `${url}/medic` });
  return info.doc_count;
}

(async () => {
  const auth = {
    // username: 'user1',
    username: process.argv[2] || 'tier11',
    password,
  };
  console.log(auth);

  const t = Date.now();
  const r = await rpn.get({ json: true, url: `${url}/api/v1/replication/get-ids`, auth });
  const n = (Date.now() - t) / 1000;
  const contacts = r.doc_ids_revs.filter(d => d.id.startsWith('contact'));
  console.log('request took', n);
  console.log('nbr contacts', contacts.length, r.doc_ids_revs.length);

  await fs.appendFileSync('./requests.csv', `${contacts.length},${r.doc_ids_revs.length},${n},${await docCount()}\n`);
})();

