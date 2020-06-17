const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user reloads the Reports page', function(usertype) {
  let wait = [
    '@GETLayout.all',
    '@GETScopes.all',
    '@GETScope.all',
    '@GETWorkPackages.all',
    '@GETNodesWorkPackageQuery.all',
    '@GETNodeLinksWorkPackageQuery.all',
    '@GETSelectorAvailabilityQuery.all'
  ];
  cy.reload();
  cy.wait(wait);
  cy.get('[data-qa=spinner]').should('not.be.visible');
});
