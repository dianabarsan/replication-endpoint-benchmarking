const fs = require('fs');
const list = fs.readFileSync('../../requests.csv', 'utf8');

const data = list.split('\n').map(line => line.split(','));
data.shift();

const lowContacts = data.filter(row => row[0] == 1100);
const highContacts = data.filter(row => row[0] > 1100);

console.log(highContacts.map(i => i.join(',')).join('\n'));
