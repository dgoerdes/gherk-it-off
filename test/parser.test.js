const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const parser = require('../lib/parser');


describe('Parse Gherkin', () => {
    let features;

    before(() => {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, './features/example.feature'), 'utf8', (err, string) => {
                if (err) reject(err);

                features = parser(string);
                resolve(string);
            });
        });
    });

    it('parses gherkin features to js object', () => {
        expect(features).to.be.an('array');
    });

    it('contains the right properties', () => {
        expect(features[0]).to.have.property('feature');
        expect(features[0]).to.have.property('scenarios');
        expect(features[0]).to.have.nested.property('scenarios[0].scenario');
        expect(features[0]).to.have.nested.property('scenarios[0].given');
        expect(features[0]).to.have.nested.property('scenarios[0].when');
        expect(features[0]).to.have.nested.property('scenarios[0].then');
        expect(features[0]).to.have.nested.property('scenarios[0].examples');
        expect(features[0]).to.have.property('comments');
    });

    it('feature contains the right content', () => {
        expect(features[0].feature).to.be.equals('Login');
    });

    it('scenario contains the right content', () => {
        expect(features[0].scenarios[0].scenario).to.be.equals('login');
        expect(features[0].scenarios[0].given).to.include('a users authentication state is <loggedOut>');
        expect(features[0].scenarios[0].when).to.include('the user provides <email> and <password>');
        expect(features[0].scenarios[0].then).to.include('the users authentication state should be <loggedIn>');
        expect(features[0].scenarios[0].then).to.include('an error should be <shown>');
    });

    it('scenario examples contain the right content', () => {
        expect(features[0].scenarios[0].examples).to.deep.include({
            loggedOut: 'false',
            email: 'aaa@bbb.com',
            password: '!A123456',
            loggedIn: 'true',
            shown: 'false'
        });
        expect(features[0].scenarios[0].examples).to.deep.include({
            loggedOut: 'false',
            email: 'abbbb-bb@bbb.com',
            password: 'A123456!',
            loggedIn: 'true',
            shown: 'false'
        });
        expect(features[0].scenarios[0].examples).to.deep.include({
            loggedOut: 'false',
            email: 'abbbb-bb@bbb.com',
            password: 'A23456!',
            loggedIn: 'false',
            shown: 'true'
        });
    });

    it('comments contain the right content', () => {
        expect(features[0].comments).to.include('Username needs to be a valid email address');
        expect(features[0].comments).to.include('Password needs to be at least 8 characters long');
    });
});
