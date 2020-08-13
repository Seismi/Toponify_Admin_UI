const { Given, When } = require('cypress-cucumber-preprocessor/steps');

When('the user cancels the creation of the radio', () => {
  cy.get(`[data-qa=radio-modal-cancel]`)
    .click({ force: true })
    .reload()
    .wait('@POSTradiosAdvancedSearch')
    .wait(['@GETRadios', '@GETNodes', '@GETRadioViews']);
});
