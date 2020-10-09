const { Then } = require('cypress-cucumber-preprocessor/steps');
const pages = require('../../common/Topology/topology_settings');

Then('the {string} {string} should not exist in {string} table in the {string} work package after reload', function(
  component_type,
  component,
  tab,
  work_package
) {
  work_package = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(work_package);
  cy.get(`[aria-posinset=${pages['tabs'][tab]}]`)
    .click()
    .then(() => {
      cy.checkTopologyTable(component, component_type, 'not.exist');
    });
});
