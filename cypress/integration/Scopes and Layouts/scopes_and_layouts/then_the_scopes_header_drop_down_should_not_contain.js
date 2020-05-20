const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the scopes header drop down should not contain {string}', function(scope) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // prefix the branch to scope
  cy.get('[data-qa=header-scopes-dropdown]') // get the scopes down
    //.click()
    .contains('mat-option', scope)
    //.click()
    .should('not.exist', scope);
});
