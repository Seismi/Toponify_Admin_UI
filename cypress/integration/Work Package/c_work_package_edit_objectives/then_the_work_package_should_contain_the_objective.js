const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the work package objective tables should contain the objective called {string}', function(objective) {
  objective = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(objective); // prefix the branch to objective
  cy.assertRowExists('work-packages-objectives-table', objective); // assert row exists
});
