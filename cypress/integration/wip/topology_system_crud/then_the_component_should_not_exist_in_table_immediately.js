const { Then } = require('cypress-cucumber-preprocessor/steps');
const pages = require('../../common/Topology/topology_settings');

Then('the {string} {string} should not exist in the table immediately', function(component_type, component) {
  cy.checkTopologyTable(component, component_type, 'not.exist');
});
