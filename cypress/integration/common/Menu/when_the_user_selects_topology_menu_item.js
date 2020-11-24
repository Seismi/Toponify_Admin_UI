const { When } = require('cypress-cucumber-preprocessor/steps');
const settings = require('../Topology/topology_settings');

When('the user selects Topology menu item', function() {
  let wait = [
    '@GETScopes',
    '@GETLayouts',
    '@GETWorkPackages',
    '@GETTeams',
    '@GETSelectorAvailabilityQuery',
    '@POSTradiosAdvancedSearch',
    '@GETScope',
    '@GETLayout',
    '@GETNodesQuery',
    '@GETNodeLinksQuery',
    '@GETSelectorAvailabilityQuery'
  ];
  cy.get(['data-qa=spinner']).should('not.be.visible');

  cy.setUpRoutes('Topology', settings);
  cy.get(`[data-qa=main-menu-open]`) // get the main menu
    .click();
  cy.get(`[data-qa=${settings['menu_selector']}]`) //get the menu selector
    .click()
    .wait(wait, { requestTimeout: 15000 }); // wait for API Calls
  cy.get(['data-qa=spinner']).should('not.be.visible');
});
