const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the user selects the {string} {string} in the {string} table', function(type, system, types) {
  types = types === 'systems' ? 'components' : 'links';
  let wait = type === 'system' ? '@GETNodesWorkPackageQuery2' : '@GETnodeLinksWorkPackageQuery';

  system = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(system); // prefix name with branch

  cy.get('[data-qa=details-spinner]').should('not.be.visible');
  cy.findSystem(`topology-table-${types}`, system)
    .contains('td', system)
    .click()
    .wait(wait)
    .get('[data-qa=details-spinner]')
    .should('not.be.visible');
});
