const { Then } = require('cypress-cucumber-preprocessor/steps');
Then('the scope component table should contain the component {string}', function(component) {
  component = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(component); // prefix the branch to scope
  cy.assertRowExists('scopes-and-layouts-components-table', component); // assert row exists
});
