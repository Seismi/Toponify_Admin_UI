const { When } = require('cypress-cucumber-preprocessor/steps');

When('cancels when asked to provide the reason for the change', () => {
  cy.get('[data-qa=radio-reply-modal-cancel]').click();
  cy.get('smi-reply-modal').should('not.exist');
});
