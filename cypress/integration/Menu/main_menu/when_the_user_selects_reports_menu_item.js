const { When } = require('cypress-cucumber-preprocessor/steps');
const settings = require('../../common/Reports/reports_settings');

When('the user selects Reports menu item', function() {
  cy.setUpRoutes('Reports', settings);
  let wait_for = [
    '@GETLayout.all',
    '@GETScopes.all',
    '@GETScope.all',
    '@GETWorkPackages.all',
    '@GETNodesWorkPackageQuery.all',
    '@GETNodeLinksWorkPackageQuery.all',
    '@GETSelectorAvailabilityQuery.all'
  ];
  cy.selectMenuItem(settings['menu_selector'], wait_for);
});
