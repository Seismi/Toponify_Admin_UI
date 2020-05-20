const { When } = require('cypress-cucumber-preprocessor/steps');
const settings = require('../Radios/radios_settings');

When('the user selects Radios menu item', function() {
  cy.setUpRoutes('My Profile', settings).then(() => {
    cy.get(`[data-qa=main-menu-open]`) // get the main menu
      .click()
      .then(() => {
        cy.get(`[data-qa=${settings['menu_selector']}]`) //get the menu selector
          .click()
          .then(() => {
            cy.wait(['@GETUsers', '@GETRadios', '@GETNodes']); // wait for API Calls
          });
      });
  });
});