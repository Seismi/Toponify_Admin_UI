const { Then } = require('cypress-cucumber-preprocessor/steps');
Then('the scope {string} should be visible in the scope table', function(scope) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // prefix the branch to scope
  cy.assertRowExists('topology-scopes-table', scope); // assert row exists
});
