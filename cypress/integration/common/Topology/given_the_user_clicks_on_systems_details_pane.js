import { Given } from 'cypress-cucumber-preprocessor/steps';

Given("the user clicks on the system's right hand side details button", function(button) {
  cy.get(`[data-qa=right-hand-side-details]`)
    .click()
    .wait([
      '@GETWorkPackageNodeTags',
      '@GETNodesScopes',
      '@GETNodesReportWorkPackageQuery',
      '@GETNodesWorkPackageQuery2'
    ]);
  cy.get('[data-qa=object-details-delete]').should('not.be.visible');
});
