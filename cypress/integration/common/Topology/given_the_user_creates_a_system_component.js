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
    .should('have.value', name)
    .get('[data-qa=topology-components-or-link-modal-save]')
    .click()
    //.wait(10000)

    .wait(['@POSTWorkPackageNodesScopeQuery', '@GETNodesQuery', '@GETNodeLinksQuery'], {
      requestTimeout: 25000,
      responseTimeout: 25000
    })
    .get('[data-qa=details-spinner]')
    .should('not.be.visible')
    .get('[data-qa=spinner]')
    .should('not.be.visible');
});
