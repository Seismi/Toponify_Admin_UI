import { Given } from 'cypress-cucumber-preprocessor/steps';

Given("the user clicks on the link's right hand side details button", function(button) {
  cy.get(`[data-qa=right-hand-side-details]`)
    .click()
    .wait([
      '@GETNodesScopes',
      '@GETNodesReportWorkPackageQuery',
      '@GETnodeLinksWorkPackageQuery',
      '@GETWorkPackageNodeLinksQuery'
    ]);
});
