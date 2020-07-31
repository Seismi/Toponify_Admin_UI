const { When } = require('cypress-cucumber-preprocessor/steps');
const settings = require('../Scope and Layouts/scope_and_layouts_settings');

When('the user selects Scopes and Layouts menu item', function() {
  cy.setUpRoutes('Scopes and Layouts', settings).then(() => {
    cy.get(`[data-qa=main-menu-open]`) // get the main menu
      .click()
      .then(() => {
        cy.get(`[data-qa=${settings['menu_selector']}]`) //get the menu selector
          .click()
          .then(() => {
            cy.wait(['@GETScopes.all']); // wait for API Calls
            cy.get('[data-qa=spinner]').should('not.be.visible');
          });
      });
  });
});
