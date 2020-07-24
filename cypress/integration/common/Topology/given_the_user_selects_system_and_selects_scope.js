const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the user selects the {string} {string} in the {string} table and selects scope tab', function(
  type,
  system,
  types,
  scope
) {
  types = types === 'systems' ? 'components' : 'links';
  system = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(system); // prefix name with branch

  cy.get('[data-qa=details-spinner]').should('not.be.visible');

  let wait = type === 'system' ? '@GETNodesWorkPackageQuery2' : '@GETnodeLinksWorkPackageQuery';

  cy.selectTableFirstRow(system, 'topology-table-quick-search', `topology-table-${types}`)
    .click()
    .get('[data-qa=details-spinner]')
    .should('not.be.visible')
    .wait(wait, { requestTimeout: 25000, responseTimeout: 25000 })
    .get('[data-qa=details-spinner]')
    .should('not.be.visible');

  cy.get(`[data-qa=right-hand-side-scopes]`)
    .click()
    .wait(['@GETWorkPackageNodeTags', '@GETNodesScopes']);
});
