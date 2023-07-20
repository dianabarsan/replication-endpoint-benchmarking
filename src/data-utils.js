const rpn = require('request-promise-native');
const { url } = require('./constants');
const placeFactory = require('./factories/cht/contacts/place');
const personFactory = require('./factories/cht/contacts/person');
const deliveryFactory = require('./factories/cht/reports/delivery');
const pregnancyFactory = require('./factories/cht/reports/pregnancy');
const pregnancyVisitFactory = require('./factories/cht/reports/pregnancy-visit');
const indexViews = async () => {
  let rows = 0;
  while (!rows) {
    try {
      console.log('indexing views');
      const res = await rpn.get({ url: `${url}/medic/_design/medic/_view/docs_by_replication_key?limit=1`, json: true });
      rows = res.rows.length;
    } catch (err) {
      await indexViews();
    }
  }
};

const saveDocs = async (docs) => {
  while (docs.length) {
    const batch = docs.splice(0, 1000);
    try {
      const opts = {
        url: `${url}/medic/_bulk_docs`,
        method: 'POST',
        json: true,
        body: { docs: batch },
      };
      await rpn(opts);
    } catch (err) {
      console.error(err.message, err.statusCode, err.options);
    }
  }

};

const createContacts = (parent, nbrClinics = 1, nbrPersons = 1) => {
  const clinics = Array
    .from({ length: nbrClinics })
    .map((_, idx) => placeFactory.place().build({
      type: 'clinic',
      parent: parent,
      name: `clinic_${idx}`,
      place_id: Math.floor(Math.random() * 10000),
    }));

  const persons = [
    ...clinics.map(clinic => Array
      .from({ length: nbrPersons })
      .map((_, idx) => personFactory.build({
        parent: { _id: clinic._id, parent: clinic.parent },
        name: `person_${clinic.name}_${idx}`,
        patient_id: Math.floor(Math.random() * 10000),
      }))),
  ].flat();

  return {
    clinics,
    persons,
  };
};

const genReport = (contact, submitter) => {
  const factory = [deliveryFactory, pregnancyFactory, pregnancyVisitFactory][Math.floor(Math.random() * 3)];
  return factory.build(getReportContext(contact, submitter));
};

const createReports = (contacts, submitter, nbrReports) => {
  return [
    ...contacts.map(contact => Array.from({ length: nbrReports }).map(() => genReport(contact, submitter)))
  ].flat();
}

const getReportContext = (patient, submitter) => {
  const context = {
    fields: {
      patient_id: patient._id,
      patient_uuid: patient._id,
      patient_name: patient.name,
    },
  };
  if (submitter?.contact) {
    context.contact = {
      _id: submitter.contact._id,
      parent: submitter.contact.parent,
    };
  }
  return context;
};

const getUserSettings = async (username) => {
  const settings = await rpn.get({ json: true, url: `${url}/_users/org.couchdb.user:${username}` });
  try {
    const facility = await rpn.get({ json: true, url: `${url}/medic/${settings.facility_id}` });
    const contact = settings.contact_id && await rpn.get({ json: true, url: `${url}/medic/${settings.contact_id}` });

    return {
      facility,
      contact,
    };
  } catch (err) {
    return {
      facility: { _id: settings.facility_id },
      contact:  { _id: settings.facility_id },
    }
  }

};

module.exports = {
  indexViews,
  saveDocs,
  createContacts,
  createReports,
  getUserSettings,
};
