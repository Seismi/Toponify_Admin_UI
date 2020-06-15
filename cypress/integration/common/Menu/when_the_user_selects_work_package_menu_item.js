const { When } = require('cypress-cucumber-preprocessor/steps');
const settings = require('../Work Package/work_package_settings');

When('the user selects Work Package menu item', function() {
  cy.setUpRoutes('Work Package', settings).then(() => {
    cy.get(`[data-qa=main-menu-open]`) // get the main menu
      .click()
      .then(() => {
        cy.get(`[data-qa=${settings['menu_selector']}]`) //get the menu selector
          .click()
          .then(() => {
            cy.wait(['@GETUsers', '@GETWorkPackages']); // wait for API Calls
          });
      });
  });
});
