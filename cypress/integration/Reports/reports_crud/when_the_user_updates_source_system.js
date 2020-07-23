const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user updates the source system to {string}', function(system) {
  system = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(system); // prefix name with branch

  cy.get('[data-qa=reports-source-system-edit]')
    .click()
    .wait('@GETNodesQuery');

  cy.selectDropDownNoClick('select-modal-search', system);

  cy.get('[data-qa=select-modal-confirm]')
    .click()
    .wait(['@PUTWorkPackageReports', '@GETReportsQuery', '@GETWorkPackageReportsTags']);
});
