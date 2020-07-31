const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user cancels the update of source system', function() {
  cy.get(`[data-qa=reports-cancel]`).click();
  //.wait(['@PUTWorkPackageReports', '@GETReportsQuery', '@GETWorkPackageReportsTags']);
});
