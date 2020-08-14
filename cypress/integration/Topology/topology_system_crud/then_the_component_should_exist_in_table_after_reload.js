const { Then } = require('cypress-cucumber-preprocessor/steps');
const pages = require('../../common/Topology/topology_settings');

Then('the {string} {string} should exist in {string} table in the {string} work package after reload', function(
  component_type,
  component,
  tab,
  work_package
) {
  work_package = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(work_package); // prefix the name with branch
  const work_package_menu = 'left-hand-pane-work-package-table';
  const wait_for = null;
  cy.editWorkPackage(work_package, work_package_menu, wait_for).then(() => {
    cy.get(`[aria-posinset=${pages['tabs'][tab]}]`)
      .click()
      .then(() => {
        cy.checkTopologyTable(component, component_type, 'exist');
      });
  });
});
