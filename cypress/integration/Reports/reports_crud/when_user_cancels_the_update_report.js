const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user cancels the update of the report', function(name, description, system) {
  cy.get('[data-qa=reports-cancel]').click();
});
