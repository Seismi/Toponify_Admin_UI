const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user confirms the delete of the scope from component', function(name, description, system) {
  cy.get('[data-qa=delete-modal-yes]')
    .click()
    .wait('@DELETEScopesNodes');
});
