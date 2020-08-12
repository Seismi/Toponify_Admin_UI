import { Given, When } from 'cypress-cucumber-preprocessor/steps';

Given('the user creates a new {string} system with name {string}', function(component_type, name, description) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); // add the branch to the name
  cy.get('[data-qa=topology-table-create-new]')
    .click()
    .selectDropDownNoClick('topology-components-or-link-modal-category', component_type)
    .get('[data-qa=topology-components-or-link-modal-name]')
    .paste(name)
    .should('have.value', name);
  cy.get('[data-qa=topology-components-or-link-modal-save]').click();

  cy.wait('@POSTWorkPackageNodesScopeQuery', { requestTimeout: 30000 });
  cy.wait(['@GETNodesQuery', '@GETNodeLinksQuery']);
  cy.get('[data-qa=spinner]').should('not.be.visible');
  cy.get('[data-qa=details-spinner]').should('not.be.visible');
});
