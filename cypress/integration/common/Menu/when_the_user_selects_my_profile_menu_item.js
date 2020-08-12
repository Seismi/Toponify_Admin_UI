const { When } = require('cypress-cucumber-preprocessor/steps');
const settings = require('../My Profile/my_profile_settings');

When('the user selects My Profile menu item', function() {
  cy.get(['data-qa=spinner']).should('not.be.visible');

  cy.setUpRoutes('My Profile', settings).then(() => {
    cy.get(`[data-qa=main-menu-open]`) // get the main menu
      .click()
      .then(() => {
        cy.get(`[data-qa=${settings['menu_selector']}]`) //get the menu selector
          .click()
          .then(() => {
            cy.wait(['@GETRoles', '@GETMyProfile', '@GETTeams']); // wait for API Calls
          });
      });
  });

  cy.get(['data-qa=spinner']).should('not.be.visible');
});
