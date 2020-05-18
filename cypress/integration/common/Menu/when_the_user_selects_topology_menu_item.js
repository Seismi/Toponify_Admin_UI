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
          let wait = ['@GETScopes', '@GETLayouts', '@GETWorkPackages', '@GETTeams', '@GETRadios', '@GETScope'];
          wait = wait.concat([
            '@GETLayout',
            '@GETNodesScopeQuery',
            '@GETNodeLinksScopeQuery',
            '@GETSelectorAvailabilityQuery'
          ]);
          wait = wait.concat(['@GETNodesScopeQuery.1', '@GETNodeLinksScopeQuery.1']);
          wait = wait.concat(['@GETNodesScopeQuery.2', '@GETNodeLinksScopeQuery.2']);
          cy.wait(wait); // wait for API Calls
        });
    });
});
