import { And } from 'cypress-cucumber-preprocessor/steps';

And('the attribute or rule {string} does not exist in the table', attr => {
  attr = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(attr);
  cy.findAttributeOrRule(attr);
});
