const { Then } = require('cypress-cucumber-preprocessor/steps');
const pages = require('../../common/Topology/topology_settings');

Then('the {string} {string} should exist on the canvas immediately', function(component_type, component) {
  cy.assertComponentExistsOnCanvas(component_type, component);
});
