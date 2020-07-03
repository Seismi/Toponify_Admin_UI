const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user reloads the Topology page', function(usertype) {
  let wait = [
    '@GETScopes.all',
    '@GETScope.all',
    '@GETLayouts.all',
    '@GETLayout.all',
    '@GETWorkPackages.all',
    '@GETTeams.all',
    '@POSTradiosAdvancedSearch.all',
    '@GETNodesQuery.all',
    '@GETNodeLinksQuery.all',
    '@GETSelectorAvailabilityQuery.all',
    '@GETNodesQuery.all',
    '@GETNodeLinksQuery.all',
    '@GETSelectorAvailabilityQuery.all'
  ];
  cy.reload();
  cy.wait(wait);
  cy.get('[data-qa=spinner]').should('not.be.visible');
});
