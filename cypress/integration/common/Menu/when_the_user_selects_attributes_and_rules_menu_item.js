const { When } = require('cypress-cucumber-preprocessor/steps');
const settings = require('../Attribute and Rules/attribute_and_rules_settings');

When('the user selects Attributes and Rules menu item', function() {
  cy.setUpRoutes('Attributes and Rules', settings).then(() => {
    cy.get(`[data-qa=main-menu-open]`) // get the main menu
      .click()
      .then(() => {
        cy.get(`[data-qa=${settings['menu_selector']}]`) //get the menu selector
          .click()
          .then(() => {
            cy.wait(['@GETScopes', '@GETWorkPackages']); // wait for API Calls
          });
      });
  });
});
