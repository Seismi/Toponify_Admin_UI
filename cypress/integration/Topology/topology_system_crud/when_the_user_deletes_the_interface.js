const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user deletes the interface {string}', function(component) {
  cy.get('[data-qa=object-details-delete]')
    .click()
    .wait('@GETworkPackagesNodeLinksDescendants')
    .then(() => {
      cy.get('[data-qa=delete-link-modal-yes]')
        .click()
        .wait([
          '@POSTworkPackagesNodeLinksDeleteRequest',
          '@GETNodesWorkPackageQuery',
          '@GETNodeLinksWorkPackageQuery'
        ]);
    });
});
