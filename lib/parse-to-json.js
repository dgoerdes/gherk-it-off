const fs = require('fs');
const path = require('path');
const globule = require('globule');
const writeFile = require('write');
const parser = require('./parser');

const processPath = process.cwd();
const args = process.argv.slice(2);
const options = {
    src: null,
    out: ''
};

args.forEach((arg, idx) => {
    switch (arg) {
        case '--src':
            options.src = args[idx + 1];
            break;
        case '--out':
            options.out = args[idx + 1];
            break;
    }
});

if (options.src) {
    const inputPaths = globule.find(options.src) || [];

    inputPaths.forEach((featurePath) => {
        const fileName = featurePath
            .split('/')
            .filter((chunk) => chunk.endsWith('.feature'))[0];

        const outputFileName = `${options.out}/${fileName.replace('.feature', '.json')}`;

        fs.readFile(path.join(processPath, featurePath), 'utf8', (err, string) => {
            if (err) console.error(err);

            const object = parser(string);

            if (object) {
                writeFile(path.join(processPath, outputFileName), JSON.stringify(object, null, 2), (err) => {
                    if (err) throw err;
                    console.log(`${outputFileName} has been created!`);
                });
            } else {
                console.error('No object was parsed out of the input string.');
            }
        });
    });
} else {
    console.log('No src defined.');
}
