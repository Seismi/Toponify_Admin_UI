const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the user selects the {string} {string} in the {string} table', function(type, system, types) {
  types = types === 'systems' ? 'components' : 'links';
  system = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(system); // prefix name with branch
  cy.selectTableFirstRow(system, 'topology-table-quick-search', `topology-table-${types}`)
    .click()
    .wait(['@GETNodesScopes', '@GETNodesWorkPackageQuery2', '@GETNodesReportWorkPackageQuery']);
});
