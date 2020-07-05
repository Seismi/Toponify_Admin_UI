const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the user selects the {string} {string} in the {string} table', function(type, system, types) {
  types = types === 'systems' ? 'components' : 'links';
  system = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(system); // prefix name with branch

  cy.get('[data-qa=details-spinner]').should('not.be.visible');

  let wait =
    type === 'system'
      ? ['@GETNodesScopes.all', '@GETNodesWorkPackageQuery2.all']
      : ['@GETNodesScopes.all', '@GETnodeLinksWorkPackageQuery.all', '@GETNodesReportWorkPackageQuery.all'];

  cy.selectTableFirstRow(system, 'topology-table-quick-search', `topology-table-${types}`)
    .click()
    .wait(wait);

  cy.get('[data-qa=details-spinner]').should('not.be.visible');
});
