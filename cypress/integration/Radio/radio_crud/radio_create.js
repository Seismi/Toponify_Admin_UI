const { Given, When } = require('cypress-cucumber-preprocessor/steps');

When('the user cancels the creation of the radio', () => {
  cy.get(`[data-qa=radio-modal-cancel]`)
    .click({ force: true })
    .reload()
    .wait(['@GETRadios', '@POSTradiosAdvancedSearch', '@GETNodes', '@GETRadioViews']);
});

/*When('DEPRECATE confirms the creation of the radio', () => {
  cy.get(`[data-qa=radio-modal-save]`)
    .click()
    .then(() => {
      cy.wait(['@POSTRadios', '@POSTradiosAdvancedSearch', '@GETRadio']);
      cy.reload();
    });
});*/
