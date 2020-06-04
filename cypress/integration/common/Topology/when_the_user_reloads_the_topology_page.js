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
    '@GETNodesScopeQuery',
    '@GETNodeLinksWorkPackageQuery',
    '@GETSelectorAvailabilityQuery.all',
    '@GETNodesWorkPackageQuery.all',
    '@GETNodeLinksWorkPackageQuery.all',
    '@GETSelectorAvailabilityQuery.all'
  ];
  cy.reload()
    .wait(10000)
    .wait(wait);
});
