const extractCaptureGroup = require('./util/extract-capturing-group');

/*
 * REGEX
 * Set of regular expressions used to match certain
 * parts of the gherkin input.
 *
 */
const regex = {
    feature: /^\s*Feature:(.+)$/,
    scenario: /^\s*Scenario:(.+)$/,
    scenarioOutline: /^\s*Scenario Outline:(.+)$/,
    given: /^\s*Given (.+)$/,
    when: /^\s*When(.+)$/,
    then: /^\s*Then (.+)$/,
    and: /^\s*And (.+)$/,
    but: /^\s*But (.+)$/,
    examples: /^\s*Examples:$/,
    example: /^\s*\|(.+)$/,
    comment: /^\s*# (.+)$/,
    lineBreak: /\r?\n/g,
};

/**
 * EXAMPLE TO OBJECT
 *
 * @param lines
 * @returns {Array}
 */
const exampleToObject = (lines) => {
    let keys = [];
    const examples = [];

    lines.forEach((line, index) => {
        const columns = line
            .split('|')
            .map((col) => col.trim())
            .filter((col) => col.length > 0);

        if (index === 0) {
            keys = columns;
        } else {
            const obj = {};
            columns.forEach((col, index) => {
                obj[keys[index]] = col;
            });
            examples.push(obj);
        }
    });

    return examples;
};

/**
 * PARSER
 *
 * @param string
 * @returns {Array}
 */
module.exports = (string) => {
    const features = [];
    const lines = string.split(regex.lineBreak);
    let featureIdx = -1;
    let scenarioIdx = -1;
    let previous;

    lines.forEach((line) => {
        if (regex.feature.test(line)) {
            featureIdx += 1;
            scenarioIdx = -1;

            features.push({
                feature: extractCaptureGroup(line, regex.feature),
                scenarios: [],
                comments: [],
            });
        }
        else if (regex.scenario.test(line)) {
            scenarioIdx += 1;

            features[featureIdx].scenarios.push({
                scenario: extractCaptureGroup(line, regex.scenario),
                given: [],
                when: [],
                then: [],
            });
        }
        else if (regex.scenarioOutline.test(line)) {
            scenarioIdx += 1;

            features[featureIdx].scenarios.push({
                scenario: extractCaptureGroup(line, regex.scenarioOutline),
                given: [],
                when: [],
                then: [],
            });
        }
        else if (regex.given.test(line)) {
            features[featureIdx].scenarios[scenarioIdx].given.push(extractCaptureGroup(line, regex.given));
            previous = features[featureIdx].scenarios[scenarioIdx].given;
        }
        else if (regex.when.test(line)) {
            features[featureIdx].scenarios[scenarioIdx].when.push(extractCaptureGroup(line, regex.when));
            previous = features[featureIdx].scenarios[scenarioIdx].when;
        }
        else if (regex.then.test(line)) {
            features[featureIdx].scenarios[scenarioIdx].then.push(extractCaptureGroup(line, regex.then));
            previous = features[featureIdx].scenarios[scenarioIdx].then;
        }
        else if (regex.and.test(line)) {
            previous.push(extractCaptureGroup(line, regex.and));
        }
        else if (regex.but.test(line)) {
            previous.push(extractCaptureGroup(line, regex.but));
        }
        else if (regex.examples.test(line)) {
            features[featureIdx].scenarios[scenarioIdx].examples = [];
        }
        else if (regex.example.test(line)) {
            features[featureIdx].scenarios[scenarioIdx].examples.push(line);
        }
        else if (regex.comment.test(line)) {
            features[featureIdx].comments.push(extractCaptureGroup(line, regex.comment))
        }
        else if (line.trim().length > 0) {
            throw new SyntaxError(line.trim());
        }
    });

    return features.map((feature) => {
        feature.scenarios = feature.scenarios.map((scenario) => {
            if (scenario.examples) {
                scenario.examplesRaw = scenario.examples.map((col) => col.trim());
                scenario.examples = exampleToObject(scenario.examples);
            }
            return scenario;
        });
        return feature;
    });
};
