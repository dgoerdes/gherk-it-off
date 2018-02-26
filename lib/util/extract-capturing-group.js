
/**
 * Extract Capturing Group
 *
 * @param line
 * @param regex
 * @param index
 * @returns {string}
 */
module.exports = (line, regex, index = 1) => {
    return line.match(regex)[index].trim();
};
