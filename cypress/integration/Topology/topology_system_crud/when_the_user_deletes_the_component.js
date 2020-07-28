const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user deletes the component {string}', function(component) {
  cy.get('[data-qa=object-details-delete]')
    .click()
    .wait('@GETworkPackagesNodesDescendants');
  cy.get('[data-qa=link-delete-spinner]').should('not.be.visible');
  cy.get('[data-qa=delete-node-modal-yes]')
    .click()
    .wait(['@POSTWorkPackagesDeleteNode', '@GETNodesQuery', '@GETNodeLinksQuery']);
  cy.get('[data-qa=spinner]').should('not.be.visible');
  cy.get('[data-qa=object-details-delete]').should('not.be.visible');
});
