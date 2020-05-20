const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the work package objective tables should not contain the objective called {string}', function(objective) {
  objective = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(objective); // prefix the name with the branch
  cy.assertRowDoesNotExist('work-packages-objectives-table', objective);
});
