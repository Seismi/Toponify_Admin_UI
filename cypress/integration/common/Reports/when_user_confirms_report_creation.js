const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user confirms the creation of the report', function() {
  cy.get('[data-qa=reports-modal-save]')
    .click()
    .wait('@POSTWorkPackageReports')
    .its('status')
    .should('eq', 200);
});
