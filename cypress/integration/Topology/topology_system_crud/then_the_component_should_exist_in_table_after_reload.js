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
  cy.get('[data-qa=left-hand-pane-work-packages]').click();
  cy.get('[data-qa=topology-work-packages-quick-search]')
    .clear()
    .paste(work_package)
    .should('have.value', work_package)
    .then(() => {
      cy.get('[data-qa=topology-work-packages-edit]').click();
    })
    .then(() => {
      cy.get('[data-qa=left-hand-pane-work-packages]').click();
    })
    .then(() => {
      cy.get(`[aria-posinset=${pages['tabs'][tab]}]`)
        .click()
        .then(() => {
          cy.checkTopologyTable(component, component_type, 'exist');
        });
    });
});
