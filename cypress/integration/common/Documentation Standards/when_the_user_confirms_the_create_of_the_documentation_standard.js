const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user confirms the creation of the documentation standard', function(action) {
  action = action === 'cancels' ? 'cancel' : 'save';
  cy.get(`[data-qa=documentation-standards-modal-${action}]`)
    .click()
    .wait('@POSTCustomProperties');
});
