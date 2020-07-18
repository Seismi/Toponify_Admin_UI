const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the radio with title {string} should not be immediately visible in the radio table', radio => {
  radio = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(radio);
  cy.findRadio(radio)
    .contains('tr', radio)
    .should('not.exist');
});

Then('the radio with title {string} should be immediately visible in the radio table', radio => {
  radio = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(radio);
  cy.findRadio(radio)
    .contains('tr', radio)
    .should('exist');
});
