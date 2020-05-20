const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user cancels the work package changes', function() {
  cy.get(`[data-qa=work-packages-cancel]`).click();
});
