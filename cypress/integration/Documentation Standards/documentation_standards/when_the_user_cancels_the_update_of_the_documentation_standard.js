const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user cancels the update of the documentation standard', function(action) {
  cy.get(`[data-qa="documentation-standards-cancel"]`).click();
});
