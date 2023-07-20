process.env.NODE_TLS_REJECT_UNAUTHORIZED=0; // allow self signed certificates

module.exports.url = 'https://admin:pass@localhost';
module.exports.password = 'Secret_1';

const rpn = require('request-promise-native');
rpn.defaults({
  transform: (body, response) => {
    throw new Error('???');
    console.log(body);
    return body;
  }
})

