import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('the user clicks on the right hand side {string} button', function(button) {
  cy.get(`[data-qa=right-hand-side-${button}]`)
    .click()
    .wait(['@GETWorkPackageNodeTags', '@GETNodesScopes', '@GETNodesReportWorkPackageQuery']);
});
