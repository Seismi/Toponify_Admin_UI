const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user cancels the work package create', function() {
  cy.get(`[data-qa=work-packages-modal-cancel]`).click();
});
