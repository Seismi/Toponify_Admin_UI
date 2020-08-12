const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the {string} should not display the error message {string}', function(control, error) {
  cy.get('[data-qa=documentation-standards-table-error]').should('not.be.visible');
});
