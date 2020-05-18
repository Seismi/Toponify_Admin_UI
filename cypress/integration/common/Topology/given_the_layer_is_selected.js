const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the {string} layer is selected', function(layer) {
  cy.selectDropDown('header-layer-dropdown', 'System View');
});
