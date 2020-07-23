const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user confirms the update of the documentation standard', function(action) {
  cy.get(`[data-qa="documentation-standards-save"]`)
    .click()
    .wait('@PUTCustomProperties');
});
