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

Then('the scope called {string} should have been deleted', function(scope) {
  assertDelete(scope, 'not.exist');
});

function assertScope(scope, operator) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // prefix the branch to scope
  cy.findScope(scope)
    .contains('tr', scope)
    .should(operator); // assert that it exists
}

function assertDelete(scope, operator) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // prefix the branch to scope
  cy.get(`[data-qa=scopes-and-layouts-scope-table]`)
    .find(`[data-qa=scopes-and-layouts-quick-search]`) // get the quick packages search
    .clear() //clear the box
    .type(scope)
    .should('have.value', scope) // type the name
    .get(`[data-qa=scopes-and-layouts-scope-table]`) // get the work packages table
    .find('table>tbody') // find the table
    .contains('tr', scope)
    .should(operator); // assert that it exists
}
