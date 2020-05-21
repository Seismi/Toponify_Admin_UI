const { When } = require('cypress-cucumber-preprocessor/steps');

When('confirms the creation of the radio', () => {
  cy.get(`[data-qa=radio-modal-save]`)
    .click()
    .then(() => {
      cy.wait('@POSTRadios');
      cy.wait(5000);
    });
});
