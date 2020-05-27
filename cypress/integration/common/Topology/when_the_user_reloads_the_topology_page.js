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
  wait = wait.concat([
    '@GETNodeLinksScopeQuery',
    '@GETNodeLinksWorkPackageQuery',
    '@GETSelectorAvailabilityQuery',
    '@GETNotifications'
  ]);
  wait = wait.concat([
    '@GETNodesWorkPackageQuery.2',
    '@GETNodeLinksWorkPackageQuery.2',
    '@GETSelectorAvailabilityQuery.2'
  ]);
  wait = wait.concat([
    '@GETNodesWorkPackageQuery.3',
    '@GETNodeLinksWorkPackageQuery.3'
    //'@GETSelectorAvailabilityQuery.3'
  ]);
  wait = wait.concat(['@GETSelectorAvailabilityQuery.3', '@GETNodesWorkPackageQuery.3']);
  cy.reload().wait(wait);
});
