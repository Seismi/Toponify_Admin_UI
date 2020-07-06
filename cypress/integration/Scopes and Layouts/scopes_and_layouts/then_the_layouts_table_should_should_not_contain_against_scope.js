const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the layouts table should contain {string} against the scope called {string}', function(layout, scope) {
  assertLayout(scope, layout, 'exist');
});

Then('the layouts table should not contain {string} against the scope called {string}', function(layout, scope) {
  assertLayout(scope, layout, 'not.exist');
});

function assertLayout(scope, layout, operator) {
  layout = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(layout); // prefix the branch to scope
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // prefix the branch to scope
  cy.findScope(scope)
    .click()
    //    .wait('@GETScope')
    .then(() => {
      cy.get('[data-qa=scopes-and-layouts-layout-table]') // get the members table
        .find('table>tbody') // find the table body
        .contains('td', layout) // find the cell that contains the user
        .should(operator); // assert that it exists
    });
}
