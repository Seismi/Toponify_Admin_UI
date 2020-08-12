const { When } = require('cypress-cucumber-preprocessor/steps');
const settings = require('../Radios/radios_settings');

When('the user selects Radios menu item', () => {
  cy.get(['data-qa=spinner']).should('not.be.visible');

  cy.setUpRoutes('Radios', settings).then(() => {
    cy.get(`[data-qa=main-menu-open]`)
      .click()
      .then(() => {
        cy.get(`[data-qa=${settings['menu_selector']}]`)
          .click()
          .then(() => {
            cy.wait('@POSTradiosAdvancedSearch');
            cy.wait(['@GETRadios', '@GETNodes', '@GETRadioViews', '@GETWorkPackages', '@GETUsers']);
          });
      });
  });
  cy.get(['data-qa=spinner']).should('not.be.visible');
});
