const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the radio with title {string} should not be immediately visible in the radio table', radio => {
  radio = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(radio);
  cy.findRadio(radio);
});
