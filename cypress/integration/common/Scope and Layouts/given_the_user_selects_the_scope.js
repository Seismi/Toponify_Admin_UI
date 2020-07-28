const { Given } = require('cypress-cucumber-preprocessor/steps');
Given('the user selects the scope called {string}', function(scope) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // prefix the branch to scope
  cy.get('[data-qa=scopes-and-layouts-quick-search]')
    .clear({ force: true })
    .type(scope)
    .should('have.value', scope)
    .then(() => {
      cy.selectRow('scopes-and-layouts-scope-table', scope);
    });
});
