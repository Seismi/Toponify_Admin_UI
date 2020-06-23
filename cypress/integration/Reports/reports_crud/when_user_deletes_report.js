const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user deletes the report', function() {
  cy.get('[data-qa=reports-delete]').click();
});
