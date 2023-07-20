const placeFactory = require('./factories/cht/contacts/place');
const personFactory = require('./factories/cht/contacts/person');
const userFactory = require('./factories/cht/users/users');

const rpn = require('request-promise-native');
const { url, password } = require('./constants');
const utils = require('./data-utils');

const createHierarchy = (name, user = false, nbrClinics = 1, nbrPersons = 1, nbrReports = 3) => {
  const hierarchy = placeFactory.generateHierarchy();
  const healthCenter = hierarchy.get('health_center');
  user = user && userFactory.build({
    place: healthCenter._id,
    roles: ['chw'],
    username: name,
    contact: { name: 'omg' },
    password: password,
  });

  const { clinics, persons } = utils.createContacts({ _id: healthCenter._id, parent: healthCenter.parent }, nbrClinics, nbrPersons);
  const reports = utils.createReports(persons, user, nbrReports);

  const places = [...hierarchy.values()].map(place => {
    place.name = `${name} ${place.type}`;
    return place;
  });

  return {
    user,
    places,
    clinics,
    persons,
    reports,
  };
};

const createUser = async (user) => {
  const createUserOpts = {
    url: `${url}/api/v2/users`,
    method: 'POST',
    json: true,
    body: user
  };

  await rpn(createUserOpts);
};

(async () => {
  const name = process.argv[2] || 'name';
  const [nbrClinics, nbrPersons, nbrReports] = (process.argv[3] || '100,10,10').split(',');
  const addUser =  process.argv[4];

  const { user, places, clinics, persons, reports } = createHierarchy(name, true, nbrClinics, nbrPersons, nbrReports);
  const docs = [...places, ...clinics, ...persons, ...reports];
  await utils.saveDocs(docs);
  addUser && await createUser([user]) && console.log('create user');
  console.log(user);
  await utils.indexViews();
})();
