const indent = require('./util/indent');

/**
 * JEST CONVERTER
 *
 * @param input
 * @returns {string}
 */
const jestConverter = (input) => {
    const lines = [];

    input.forEach((f) => {
        lines.push(`describe('Feature: ${f.feature}', () => {`);

        // Comments
        f.comments.forEach((c) => {
            lines.push(`${indent(1)}// ${c}`);
        });
        lines.push('');

        // Scenarios
        f.scenarios.forEach((s) => {
            lines.push(`${indent(1)}describe('Scenario: ${s.scenario}', () => {`);

            // Examples
            if (s.examplesRaw && s.examplesRaw.length) {
                lines.push(`${indent(2)}// Examples:`);
                lines.push(`${indent(2)}//`);

                s.examplesRaw.forEach((e) => {
                    lines.push(`${indent(2)}// ${e}`);
                });
            }
            lines.push('');

            // Given
            s.given.forEach((given) => {
                lines.push(`${indent(2)}it('Given: ${given.replace(/[<>]/g, '"')}', () => {`);
                lines.push(`${indent(2)}});`);
                lines.push('');
            });

            // When
            s.when.forEach((when) => {
                lines.push(`${indent(2)}it('When: ${when.replace(/[<>]/g, '"')}', () => {`);
                lines.push(`${indent(2)}});`);
                lines.push('');
            });

            // Then
            s.then.forEach((then) => {
                lines.push(`${indent(2)}it('Then: ${then.replace(/[<>]/g, '"')}', () => {`);
                lines.push(`${indent(2)}});`);
                lines.push('');
            });
        });
        lines.push(`${indent(1)}});`);

        lines.push('});');
        lines.push('');
    });

    return lines.join('\n');
};

module.exports = {
    fileExt: '.spec.js',
    func: jestConverter,
};
