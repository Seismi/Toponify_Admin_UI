const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user deletes the component {string}', function(component) {
  cy.get('[data-qa=object-details-delete]')
    .click()
    .wait('@GETworkPackagesNodesDescendants')
    .then(() => {
      cy.get('[data-qa=delete-node-modal-yes]')
        .click()
        .wait(['@POSTWorkPackagesDeleteNode', '@GETNodesWorkPackageQuery', '@GETNodeLinksWorkPackageQuery']);
      cy.get('[data-qa=object-details-delete]').should('not.be.visible');
    });
});
