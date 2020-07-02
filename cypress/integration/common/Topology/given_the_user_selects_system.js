const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the user selects the {string} {string} in the {string} table', function(type, system, types) {
  types = types === 'systems' ? 'components' : 'links';
  system = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(system); // prefix name with branch

  let wait =
    type === 'system'
      ? ['@GETNodesScopes.all', '@GETNodesWorkPackageQuery2.all', '@GETNodesReportWorkPackageQuery.all']
      : ['@GETNodesScopes.all', '@GETnodeLinksWorkPackageQuery.all', '@GETNodesReportWorkPackageQuery.all'];
  cy.selectTableFirstRow(system, 'topology-table-quick-search', `topology-table-${types}`)
    .click()
    .wait(15000)
    .wait(wait);
});
