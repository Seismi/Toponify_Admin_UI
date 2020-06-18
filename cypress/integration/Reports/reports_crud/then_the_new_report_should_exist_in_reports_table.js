import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('the new report {string} should exist in the reports table', function(name) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); // prefix name with branch
  cy.findReport(name)
    .contains(name)
    .should('exist');
});
