import { And } from 'cypress-cucumber-preprocessor/steps';

And('the attribute or rule {string} does not exist in the table', attr => {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name);
  cy.findAttributeOrRule(attr);
});
