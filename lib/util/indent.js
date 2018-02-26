
/**
 * INDENT
 *
 * @param count - number of indents (default 1)
 * @param chars - indentation characters (default: '    ')
 * @returns {string}
 */
module.exports = (count = 1, chars = '    ') => {
    const indentation = [];

    for (let i = 0; i < count; i++) {
        indentation.push(chars);
    }

    return indentation.join('');
};
