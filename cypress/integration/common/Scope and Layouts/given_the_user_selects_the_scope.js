const { Given } = require('cypress-cucumber-preprocessor/steps');
Given('the user selects the scope called {string}', function(scope) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // prefix the branch to scope
  cy.selectRow('scopes-and-layouts-scope-table', scope).click();
});
