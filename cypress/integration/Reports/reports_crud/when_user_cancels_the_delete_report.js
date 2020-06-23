const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user cancels the delete of the report', function(name, description, system) {
  cy.get('[data-qa=report-delete-modal-no]').click();
});
