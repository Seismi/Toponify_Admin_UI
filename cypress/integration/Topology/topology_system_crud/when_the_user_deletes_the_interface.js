const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user deletes the interface {string}', function(component) {
  cy.get('[data-qa=object-details-delete]')
    .click()
    .wait('@GETworkPackagesNodeLinksDescendants');
  cy.get('[data-qa=link-delete-spinner]').should('not.be.visible');
  cy.get('[data-qa=delete-link-modal-yes]')
    .click()
    .wait('@POSTworkPackagesNodeLinksDeleteRequest')
    .wait(['@GETNodesQuery', '@GETNodeLinksQuery']);
  cy.get('[data-qa=spinner]').should('not.be.visible');
  cy.get('[data-qa=object-details-delete]').should('not.be.visible');
});
