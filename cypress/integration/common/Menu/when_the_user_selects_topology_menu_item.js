const { When } = require('cypress-cucumber-preprocessor/steps');
const settings = require('../Topology/topology_settings');

When('the user selects Topology menu item', function() {
  cy.setUpRoutes('Topology', settings);
  cy.get(`[data-qa=main-menu-open]`) // get the main menu
    .click()
    .then(() => {
      cy.get(`[data-qa=${settings['menu_selector']}]`) //get the menu selector
        .click()
        .then(() => {
          let wait = [
            '@GETScopes.all',
            '@GETLayouts.all',
            '@GETWorkPackages.all',
            '@GETTeams.all',
            '@GETSelectorAvailabilityQuery.all',
            '@POSTradiosAdvancedSearch.all',
            '@GETScope.all',
            '@GETLayout.all',
            '@GETNodesScopeQuery.all',
            '@GETNodeLinksScopeQuery.all',
            '@GETSelectorAvailabilityQuery.all'
          ];
          cy.get(['data-qa=spinner'])
            .should('not.be.visible')
            .wait(wait); // wait for API Calls
        });
    });
});
