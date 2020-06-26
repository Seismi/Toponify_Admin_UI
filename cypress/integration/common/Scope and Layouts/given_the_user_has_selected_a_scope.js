const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the user has selected the scope {string}', function(scope) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // prefix the branch to scope
  cy.selectDropDownNoClick('header-scopes-dropdown', scope);
  cy.get('[data-qa=spinner]').should('not.be.visible');
  cy.wait(['@GETScope.all', '@GETLayout.all', '@GETNodesWorkPackageQuery.all', '@GETNodeLinksWorkPackageQuery.all']);
  cy.get('[data-qa=spinner]').should('not.be.visible');
});
