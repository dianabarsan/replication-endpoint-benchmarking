const rpn = require('request-promise-native');
const { url, password } = require('./constants');
const utils = require('./data-utils');

const getContacts = async (user) => {
  const auth = { username: user, password };

  const { doc_ids_revs } = await rpn.get({ json: true, url: `${url}/api/v1/replication/get-ids`, auth });
  const contacts = doc_ids_revs.filter(d => d.id.startsWith('contact')).map(({ id }) => ({ _id: id }));
  return contacts;
};

const createReports = (contacts, submitter, nbrReports) => {
  let perContact;
  if (nbrReports < contacts.length) {
    contacts = contacts.slice(0, nbrReports);
    perContact = 1;
  } else {
    perContact = Math.floor(nbrReports/contacts.length);
  }

  return utils.createReports(contacts, submitter, perContact);
};


(async () => {
  const user = process.argv[2];
  const nbrReports = process.argv[3] || 1000;

  const contacts = await getContacts(user);
  const { contact: submitter } = await utils.getUserSettings(user);
  const reports = createReports(contacts, submitter, nbrReports);
  await utils.saveDocs(reports);

  await utils.indexViews();
})();
