const { When } = require('cypress-cucumber-preprocessor/steps');
const settings = require('../Settings/settings_settings');

When('the user selects Settings menu item', function() {
  cy.setUpRoutes('Settings', settings);
  cy.get(`[data-qa=main-menu-open]`) // get the main menu
    .click()
    .then(() => {
      cy.get(`[data-qa=${settings['menu_selector']}]`) //get the menu selector
        .click()
        .then(() => {
          cy.wait(['@GETRoles']); // wait for API Calls
        });
    });
});
