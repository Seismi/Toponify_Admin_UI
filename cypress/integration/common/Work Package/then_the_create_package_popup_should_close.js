const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the create package pop-up should close', function() {
  cy.get(`[data-qa=work-packages-details-form-modal]`) //assert that the pop up modal closes
    .should('not.exist');
});
