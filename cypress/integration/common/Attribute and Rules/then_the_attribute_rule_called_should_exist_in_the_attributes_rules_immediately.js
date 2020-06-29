import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('the {string} called {string} should exist in the attributes and rules table immediately', (attRule, name) => {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name);
  cy.selectRow('rules-and-attributes-table', name)
    .click()
    .wait(['@GETAttributes', '@GETAttributeAndRule']);
});
