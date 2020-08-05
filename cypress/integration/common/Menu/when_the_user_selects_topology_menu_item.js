const { When } = require('cypress-cucumber-preprocessor/steps');
const settings = require('../Topology/topology_settings');

When('the user selects Topology menu item', function() {
  let wait = ['@GETNodesQuery', '@GETNodeLinksQuery'];

  cy.setUpRoutes('Topology', settings);
  cy.get(`[data-qa=main-menu-open]`) // get the main menu
    .click();
  cy.get(`[data-qa=${settings['menu_selector']}]`) //get the menu selector
    .click()
    .url()
    //.should('contain','topology?filterLevel')
    //.should('contain','scope')
    //.should('contain','workpackages')
    .should(
      'match',
      '//topology?filterLevel=system&scope=[w]{8}(-[w]{4}){3}-[w]{12}&workpackages=[w]{8}(-[w]{4}){3}-[w]{12}/'
    )
    .wait(wait);

  //http://localhost:4202/topology?filterLevel=system&scope=00000000-0000-0000-0000-000000000000&workpackages=6b307651-5c25-4175-93d4-b4e9c47767d2
  //.wait(wait); // wait for API Calls
  cy.get(['data-qa=spinner']).should('not.be.visible');
});
