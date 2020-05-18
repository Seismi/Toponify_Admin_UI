const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user resets the work package', function() {
  cy.get(`[data-qa=work-packages-reset]`).click(); // get and click the reset button
});
