const { When } = require('cypress-cucumber-preprocessor/steps');
const settings = require('../Radios/radios_settings');

When('the user selects Radios menu item', () => {
  cy.setUpRoutes('Radios', settings).then(() => {
    cy.get(`[data-qa=main-menu-open]`)
      .click()
      .then(() => {
        cy.get(`[data-qa=${settings['menu_selector']}]`)
          .click()
          .then(() => {
            cy.wait([
              '@GETRadios',
              '@POSTradiosAdvancedSearch.1',
              '@POSTradiosAdvancedSearch.2',
              '@GETNodes',
              '@GETRadioViews',
              '@GETWorkPackages',
              '@GETUsers'
            ]);
          });
      });
  });
});
