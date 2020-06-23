import { Given } from 'cypress-cucumber-preprocessor/steps';

Given("the user clicks on the system's right hand side documentation standard button", function(button) {
  cy.get(`[data-qa=right-hand-side-documentation-standards]`)
    .click()
    .wait(['@GETNodesScopes', '@GETNodesWorkPackageQuery2', '@GETNodesReportWorkPackageQuery']);
  cy.get('[data-qa=spinner]').should('not.be.visible');
});
