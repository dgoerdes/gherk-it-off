#!/usr/bin/env node
const path = require('path');
const jsonConverter = require('./lib/json-converter');
const jestConverter = require('./lib/jest-converter');
const convert = require('./lib/convert');

const processPath = process.cwd();
const args = process.argv.slice(2);
const options = {
    src: null,
    out: '',
    converter: jestConverter,
};

args.forEach((arg, idx) => {
    switch (arg) {
        case '--src':
            options.src = path.join(processPath, args[idx + 1]);
            break;
        case '--out':
            options.out = path.join(processPath, args[idx + 1]);
            break;
        case '--converter':
            if (args[idx + 1] === 'jest') {
                options.converter = jestConverter;
            }
            if (args[idx + 1] === 'json') {
                options.converter = jsonConverter;
            }
            break;
    }
});

convert(options.src, options.out, options.converter);
