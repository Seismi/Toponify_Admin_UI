const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user confirms the update of source system', function() {
  cy.get(`[data-qa=reports-save]`)
    .click()
    .wait(['@PUTWorkPackageReports', '@GETReportsQuery', '@GETWorkPackageReportsTags']);
});
