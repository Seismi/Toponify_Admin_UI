const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user selects the report {string} in the reports table', function(report) {
  report = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(report); // prefix name with branch
  cy.findReport(report)
    .contains('td', report)
    .click()
    .wait('@GETReportsFilterQuery.all');
});
