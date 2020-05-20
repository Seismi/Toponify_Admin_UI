const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps');

When('the scope called {string} is deleted', function(scope) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // prefix the branch to scope
  cy.findScope(scope)
    .click()
    .wait(['@GETScope', '@GETLayout'])
    .then(() => {
      cy.get('[data-qa=scopes-and-layouts-scope-details-form]')
        .within(() => {
          cy.get('[data-qa=scopes-and-layouts-delete]').click();
        })
        .then(() => {
          cy.get('[data-qa=delete-modal-yes]')
            .click()
            .wait('@DELETEScopes');
        });
    });
});
