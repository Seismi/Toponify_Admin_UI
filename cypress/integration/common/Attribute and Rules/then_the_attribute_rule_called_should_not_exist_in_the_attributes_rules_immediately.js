import { And } from 'cypress-cucumber-preprocessor/steps';

And('the {string} called {string} should not exist in the attributes and rules table immediately', (attRule, name) => {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name);
  cy.findAttributeOrRule(name);
});
