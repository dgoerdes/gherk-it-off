const extractCaptureGroup = require('./extract-capturing-group');

const matches = {
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

const transformExample = (lines) => {
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

const parse = (string) => {
    const features = [];
    const lines = string.split(matches.lineBreak);
    let featureIdx = -1;
    let scenarioIdx = -1;
    let previous;

    lines.forEach((line) => {
        if (matches.feature.test(line)) {
            featureIdx += 1;
            scenarioIdx = -1;

            features.push({
                feature: extractCaptureGroup(line, matches.feature),
                scenarios: [],
                comments: [],
            });
        }
        else if (matches.scenario.test(line)) {
            scenarioIdx += 1;

            features[featureIdx].scenarios.push({
                scenario: extractCaptureGroup(line, matches.scenario),
                given: [],
                when: [],
                then: [],
            });
        }
        else if (matches.scenarioOutline.test(line)) {
            scenarioIdx += 1;

            features[featureIdx].scenarios.push({
                scenario: extractCaptureGroup(line, matches.scenarioOutline),
                given: [],
                when: [],
                then: [],
            });
        }
        else if (matches.given.test(line)) {
            features[featureIdx].scenarios[scenarioIdx].given.push(extractCaptureGroup(line, matches.given));
            previous = features[featureIdx].scenarios[scenarioIdx].given;
        }
        else if (matches.when.test(line)) {
            features[featureIdx].scenarios[scenarioIdx].when.push(extractCaptureGroup(line, matches.when));
            previous = features[featureIdx].scenarios[scenarioIdx].when;
        }
        else if (matches.then.test(line)) {
            features[featureIdx].scenarios[scenarioIdx].then.push(extractCaptureGroup(line, matches.then));
            previous = features[featureIdx].scenarios[scenarioIdx].then;
        }
        else if (matches.and.test(line)) {
            previous.push(extractCaptureGroup(line, matches.and));
        }
        else if (matches.but.test(line)) {
            previous.push(extractCaptureGroup(line, matches.but));
        }
        else if (matches.examples.test(line)) {
            features[featureIdx].scenarios[scenarioIdx].examples = [];
        }
        else if (matches.example.test(line)) {
            features[featureIdx].scenarios[scenarioIdx].examples.push(line);
        }
        else if (matches.comment.test(line)) {
            features[featureIdx].comments.push(extractCaptureGroup(line, matches.comment))
        }
        else if (line.trim().length > 0) {
            throw new SyntaxError(line.trim());
        }
    });

    return features.map((feature) => {
        feature.scenarios = feature.scenarios.map((scenario) => {
            if (scenario.examples) {
                scenario.examples = transformExample(scenario.examples);
            }
            return scenario;
        });
        return feature;
    });
};

module.exports = parse;
