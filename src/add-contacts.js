const utils = require('./data-utils');

(async () => {
  const user = process.argv[2];
  const [nbrClinics, nbrPersons] = (process.argv[3] || '100,10').split(',');

  const { facility } = await utils.getUserSettings(user);

  const { clinics, persons} = utils.createContacts(facility, nbrClinics, nbrPersons);
  const docs = [...clinics, ...persons];
  await utils.saveDocs(docs);
})();
