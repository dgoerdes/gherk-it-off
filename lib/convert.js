const fs = require('fs');
const path = require('path');
const globule = require('globule');
const writeFile = require('write');
const parser = require('./parser');

/**
 * CONVERT
 *
 * @param inputSrc - glob to define the files used as src
 * @param outputSrc - output destination
 * @param converter - converter used to generate the output
 */
module.exports = (inputSrc, outputSrc, converter) => {
    if (!inputSrc) throw new Error('No input source defined.');

    const inputPaths = globule.find(inputSrc);
    inputPaths.forEach((featurePath) => {
        const fileName = featurePath
            .split('/')
            .filter((chunk) => chunk.endsWith('.feature'))[0];
        const outputFileName = `${outputSrc}/${fileName.replace('.feature', converter.fileExt)}`;

        fs.readFile(path.join(featurePath), 'utf8', (err, string) => {
            if (err) throw err;

            const object = parser(string);
            writeFile(path.join(outputFileName), converter.func(object), (err) => {
                if (err) throw err;

                console.log(`${outputFileName} has been created!`);
            });
        });
    });
};
