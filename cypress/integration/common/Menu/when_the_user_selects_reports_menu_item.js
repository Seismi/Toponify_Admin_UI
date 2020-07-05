const { When } = require('cypress-cucumber-preprocessor/steps');
const settings = require('../Reports/reports_settings');

When('the user selects Reports menu item', function() {
  cy.setUpRoutes('Reports', settings);
  cy.get(`[data-qa=main-menu-open]`) // get the main menu
    .click()
    .then(() => {
      cy.get(`[data-qa=${settings['menu_selector']}]`) //get the menu selector
        .click()
        .then(() => {
          cy.wait([
            '@GETLayout.all',
            '@GETScopes.all',
            '@GETScope.all',
            '@GETWorkPackages.all',
            '@GETNodesQuery.all',
            '@GETNodeLinksQuery.all',
            '@GETSelectorAvailabilityQuery.all'
          ]); // wait for API Calls
        });
      cy.get('[data-qa=spinner]').should('not.be.visible');
    });
});
