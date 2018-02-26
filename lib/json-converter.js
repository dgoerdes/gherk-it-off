
/**
 * JSON CONVERTER
 *
 * @param input
 * @returns {string}
 */
module.exports = {
    fileExt: '.json',
    func: (input) => {
        return JSON.stringify(input, null, 2);
    },
};
