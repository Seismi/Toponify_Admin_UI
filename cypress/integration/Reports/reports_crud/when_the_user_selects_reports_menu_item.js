const { When } = require('cypress-cucumber-preprocessor/steps');
const settings = require('../../common/Reports/reports_settings');

When('the user selects Reports menu item', function() {
  cy.setUpRoutes('Reports', settings);
  let wait_for = [
    '@GETScopes',
    '@GETScope',
    '@GETWorkPackages',
    '@GETSelectorAvailabilityQuery',
    '@GETLayout',
    '@GETReportsFilterQuery.all'
  ];
  cy.selectMenuItem(settings['menu_selector'], wait_for);
});
