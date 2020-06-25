const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the reports table should contain the report {string}', function(report) {
  report = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(report); // prefix the branch to objective
  cy.assertRowExists('topology-reports-table', report); // assert row exists
});
