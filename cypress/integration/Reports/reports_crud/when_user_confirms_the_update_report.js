const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user confirms the update of the report name and description', function(name, description, system) {
  cy.get('[data-qa=reports-save]')
    .click()
    .wait(['@PUTWorkPackageReports', '@GETReportsQuery', '@GETWorkPackageReportsTags.all'])
    .wait(2000);
});
