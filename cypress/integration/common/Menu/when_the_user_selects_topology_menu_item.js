const { When } = require('cypress-cucumber-preprocessor/steps');
const settings = require('../Topology/topology_settings');

When('the user selects Topology menu item', function() {
  let wait = [
    '@GETScopes.all',
    '@GETLayouts.all',
    '@GETWorkPackages.all',
    '@GETTeams.all',
    '@GETSelectorAvailabilityQuery.all',
    '@POSTradiosAdvancedSearch.all',
    '@GETScope.all',
    '@GETLayout.all',
    '@GETNodesQuery.all',
    '@GETNodeLinksQuery.all',
    '@GETSelectorAvailabilityQuery.all' //,
    //'@PUTLayoutNodes'
  ];

  cy.setUpRoutes('Topology', settings);
  cy.get(`[data-qa=main-menu-open]`) // get the main menu
    .click();
  cy.get(`[data-qa=${settings['menu_selector']}]`) //get the menu selector
    .click()
    .wait(wait); // wait for API Calls
  cy.get(['data-qa=spinner']).should('not.be.visible');
});
