const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user updates the source system to {string}', function(system) {
  system = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(system); // prefix name with branch

  cy.get('[data-qa=reports-source-system-edit]')
    .click()
    .wait('@GETNodesQuery');

  cy.selectDropDownNoClick('single-select-modal-search', system);

  cy.get('[data-qa=single-select-modal-confirm]')
    .click()
    .wait(['@PUTWorkPackageReports', '@GETReportsQuery', '@GETWorkPackageReportsTags']);
});
