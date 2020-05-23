const { Then } = require('cypress-cucumber-preprocessor/steps');
const pages = require('../../common/Topology/topology_settings');

Then('the {string} {string} should exist on the canvas in the {string} work package after reload', function(
  component,
  work_package
) {
  cy.assertComponentExistsOnCanvas(component, work_package);
});
