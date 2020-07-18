const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user reloads the Topology page', function(usertype) {
  let wait = [
    '@GETScopes',
    '@GETScope',
    '@GETLayouts',
    '@GETLayout',
    '@GETWorkPackages',
    '@GETTeams',
    '@POSTradiosAdvancedSearch',
    '@GETNodesQuery',
    '@GETNodeLinksQuery',
    '@GETSelectorAvailabilityQuery'
  ];
  cy.reload();
  cy.wait(wait);
  cy.get('[data-qa=spinner]').should('not.be.visible');
});
