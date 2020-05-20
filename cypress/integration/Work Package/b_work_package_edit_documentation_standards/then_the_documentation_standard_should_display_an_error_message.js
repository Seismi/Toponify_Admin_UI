const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the {string} should display the error message {string}', function(control, error) {
  cy.get('[data-qa=documentation-standards-table-error]').should('have.text', error);
});
