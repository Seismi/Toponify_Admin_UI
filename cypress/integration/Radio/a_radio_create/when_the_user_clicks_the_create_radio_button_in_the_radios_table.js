const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user clicks on create new radio at the button of the radio table', () => {
  cy.get(`[data-qa=radio-create-new]`).click();
});
