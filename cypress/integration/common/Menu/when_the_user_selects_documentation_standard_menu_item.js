const { When } = require('cypress-cucumber-preprocessor/steps');
const settings = require('../Documentation Standards/documentation_standards_settings');

When('the user selects Documentation Standard menu item', function() {
  cy.setUpRoutes('Documentation Standard', settings).then(() => {
    cy.get(`[data-qa=main-menu-open]`) // get the main menu
      .click()
      .then(() => {
        cy.get(`[data-qa=${settings['menu_selector']}]`) //get the menu selector
          .click()
          .then(() => {
            cy.wait(['@GETCustomProperties']); // wait for API Calls
          });
      });
  });
});
