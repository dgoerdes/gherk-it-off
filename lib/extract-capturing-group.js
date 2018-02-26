/**
 * Extract Capturing Group
 *
 * @param line
 * @param regex
 * @returns {string}
 */
module.exports = (line, regex) => {
    return line.match(regex)[1].trim();
};
