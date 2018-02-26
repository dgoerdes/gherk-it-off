const fs = require('fs');
const path = require('path');
const { parser } = require('./index');

fs.readFile(path.join(__dirname, './test/features/example.feature'), 'utf8', (err, string) => {
    if (err) console.error(err);

    const obj = parser(string);
    console.log(JSON.stringify(obj, null, 2));
});
