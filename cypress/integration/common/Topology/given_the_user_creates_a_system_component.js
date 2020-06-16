import { Given, When } from 'cypress-cucumber-preprocessor/steps';

Given('the user creates a new {string} system with name {string}', function(component_type, name, description) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); // add the branch to the name
  cy.get('[data-qa=topology-table-create-new]')
    .click()
    .then(() => {
      cy.selectDropDownNoClick('topology-components-or-link-modal-category', component_type).then(() => {
        cy.get('[data-qa=topology-components-or-link-modal-name]')
          .type(name)
          .should('have.value', name)
          .then(() => {
            cy.get('[data-qa=topology-components-or-link-modal-save]')
              .click()
              .wait(['@POSTWorkPackageNodesScopeQuery', '@GETNodesWorkPackageQuery', '@GETNodeLinksWorkPackageQuery']);
            cy.get('[data-qa=spinner]').should('not.be.visible');
          });
      });
    });
});
