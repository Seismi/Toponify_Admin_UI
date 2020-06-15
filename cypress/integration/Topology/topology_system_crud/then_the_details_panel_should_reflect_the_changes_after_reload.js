const { Then } = require('cypress-cucumber-preprocessor/steps');
const topology = require('../../common/Topology/topology_settings');
const workPackage = require('../../common/Work Package/work_package_settings');

Then(
  'the details panel should reflect the reference number: {string}, name: {string}, category: {string}, description: {string}, owners {string} against work package {string} after reload',
  function(reference, system, category, description, owners, work_package) {
    work_package = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(work_package); // prefix the name with branch
    system = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(system); // prefix the name with branch
    cy.editWorkPackageTopology(work_package).then(() => {
      cy.get('[data-qa=topology-tabs]')
        .find(`[aria-posinset=${topology['tabs']['Systems']}]`) // use the current pane set up file to identify the posinset for angular materials tab as data-qa cannot be used
        .click()
        .then(() => {
          cy.selectTableFirstRow(system, 'topology-table-quick-search', 'topology-table-components')
            .click()
            .wait(['@GETNodesWorkPackageQuery2', '@GETNodesReportWorkPackageQuery', '@GETNodesScopes'])
            .then(() => {
              cy.get('[data-qa=spinner]').should('not.be.visible');
              cy.selectDetailsPaneTab(workPackage['tabs']['Details']).wait('@GETWorkPackageNodeTags');
              cy.assertDetailsForm(reference, system, description, category);
            });
        });
    });
  }
);
