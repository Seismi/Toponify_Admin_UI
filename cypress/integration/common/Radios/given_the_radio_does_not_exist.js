const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the radio {string} does not exist', radio => {
  radio = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(radio);
  cy.findRadio(radio);
});
