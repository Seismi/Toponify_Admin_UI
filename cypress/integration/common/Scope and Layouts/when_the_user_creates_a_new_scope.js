const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user creates a new scope called {string}', function(scope) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // prefix the branch to scope
  cy.get('[data-qa=scopes-and-layouts-scope-table]')
    .find('[data-qa=scopes-and-layouts-create-new]')
    .click()
    .then(() => {
      cy.get('[data-qa=scopes-and-layouts-details-name]')
        .clear({ force: true })
        .type(scope)
        .should('have.value', scope)
        .then(() => {
          cy.get('[data-qa=scopes-and-layouts-modal-save]')
            .click()
            .wait('@POSTScopes');
        });
    });
});
