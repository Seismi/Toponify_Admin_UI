const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the menu should not be visible', function(component_type, component) {
  cy.get('smi-menu').should('not.exist');
});
