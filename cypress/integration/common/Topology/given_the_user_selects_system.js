const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the user selects the system {string} in the systems table', function(system) {
  //system = system === 'HR' ? 'HR' : Cypress.env("BRANCH").concat(" | ").concat(system) // add the branch to the name
  cy.selectTableFirstRow(system, 'topology-table-quick-search', 'topology-table-components').click();
  //.wait(['@GETNodesReportWorkPackageQuery','@GETNodesWorkPackageQuery2','@GETNodesScopes'])
  //.wait(['@GETNodesReportWorkPackageQuery'])
});
