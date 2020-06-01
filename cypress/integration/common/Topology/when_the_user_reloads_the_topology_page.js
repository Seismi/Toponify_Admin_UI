const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user reloads the Topology page', function(usertype) {
  let wait = [
    '@GETScopes',
    '@GETScope',
    '@GETLayouts',
    '@GETLayout',
    '@GETWorkPackages',
    '@GETTeams',
    '@GETRadios',
    '@GETNodesScopeQuery'
  ];
  wait = wait.concat(['@GETNodeLinksWorkPackageQuery', '@GETSelectorAvailabilityQuery', '@GETNotifications']);
  wait = wait.concat([
    '@GETNodesWorkPackageQuery.2',
    '@GETNodeLinksWorkPackageQuery.2',
    '@GETSelectorAvailabilityQuery.2'
  ]);
  cy.reload().wait(wait);
});
