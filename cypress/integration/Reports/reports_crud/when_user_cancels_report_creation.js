const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user cancels the creation of the report', function() {
  cy.get('[data-qa=reports-modal-cancel]').click();
});
