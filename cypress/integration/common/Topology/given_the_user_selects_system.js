const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the user selects the {string} {string} in the {string} table', function(type, system, types) {
  types = types === 'systems' ? 'components' : 'links';
  system = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(system); // prefix name with branch

  cy.get('[data-qa=details-spinner]').should('not.be.visible');

  let wait =
    type === 'system'
      ? ['@GETNodesScopes', '@GETNodesWorkPackageQuery2']
      : ['@GETNodesScopes.all', '@GETnodeLinksWorkPackageQuery.all', '@GETNodesReportWorkPackageQuery.all'];

  cy.selectTableFirstRow(system, 'topology-table-quick-search', `topology-table-${types}`)
    .click()
    .get('[data-qa=details-spinner]')
    .should('not.be.visible')
    .wait(15000)
    .wait(wait, { requestTimeout: 25000, responseTimeout: 25000 })
    .get('[data-qa=details-spinner]')
    .should('not.be.visible');
});
