const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the create radio pop-up should close', () => {
  cy.get(`[data-qa=radio-details-form-modal]`).should('not.exist');
});
