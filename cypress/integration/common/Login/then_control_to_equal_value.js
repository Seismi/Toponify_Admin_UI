const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('{string} should read {string}', function(control, error_message) {
  cy.get(`[data-qa=${control}]`).should('contain', error_message); // the control should contain error message
});
