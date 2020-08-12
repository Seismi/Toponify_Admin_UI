const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user {string} the deletion of the documentation standard', function(action) {
  if (action === 'confirms') {
    cy.get('[data-qa=delete-modal-yes]')
      .click()
      .wait('@DELETECustomProperties');
  } else {
    cy.get('[data-qa=delete-modal-no]').click();
  }
});
