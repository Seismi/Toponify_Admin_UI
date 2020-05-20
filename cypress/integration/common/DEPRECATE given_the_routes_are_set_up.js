const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('DEPRECATE the {string} routes are set up', function(route) {
  cy.setUpRoutes(route);
});
