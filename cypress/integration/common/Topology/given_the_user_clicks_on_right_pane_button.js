import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('the user clicks on the right hand side details button', function(button) {
  cy.get(`[data-qa=right-hand-side-details]`)
    .click()
    .wait([
      '@GETWorkPackageNodeTags',
      '@GETNodesScopes',
      '@GETNodesReportWorkPackageQuery',
      '@GETNodesWorkPackageQuery2'
    ]);
});
