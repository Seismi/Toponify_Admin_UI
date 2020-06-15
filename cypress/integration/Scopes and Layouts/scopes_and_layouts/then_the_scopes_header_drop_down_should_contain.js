const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the scopes header drop down should contain {string}', function(scope) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // prefix the branch to scope
  cy.get('[data-qa=header-scopes-dropdown]') // get the scopes table
    .click()
    .then(() => {
      cy.root()
        .contains('mat-option', scope)
        .should('exist')
        .type('{esc}')
        .wait(['@GETLayout.all', '@GETNodesScopeQuery.all', '@GETNodeLinksScopeQuery.all']);
      cy.get('[data-qa=spinner]').should('not.be.visible');
    });
});
