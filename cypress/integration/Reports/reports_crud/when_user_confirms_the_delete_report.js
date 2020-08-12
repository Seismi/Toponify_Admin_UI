const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user confirms the delete of the report', function(name, description, system) {
  cy.get('[data-qa=report-delete-modal-yes]')
    .click()
    .wait('@POSTWorkPackageDeleteRequest')
    .wait(['@GETReportsQuery', '@GETReportsFilterQuery']);
});
