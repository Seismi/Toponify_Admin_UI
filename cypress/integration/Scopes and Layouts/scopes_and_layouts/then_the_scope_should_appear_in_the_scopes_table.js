const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps');

Then('the scope called {string} should appear in the scopes table with filtering component {string}', function(
  scope,
  component
) {
  assertScope(scope, 'exist');
});

Then('the scope called {string} should not appear in the scopes table', function(scope) {
  assertScope(scope, 'not.exist');
});

function assertScope(scope, operator) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // prefix the branch to scope
  cy.findScope(scope)
    .contains('tr', scope)
    .should(operator); // assert that it exists
}
