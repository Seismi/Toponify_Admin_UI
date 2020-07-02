const { Given } = require('cypress-cucumber-preprocessor/steps');
const pages = require('../Topology/topology_settings');

Given('the "Topology" "Canvas" Tab is selected', function(screen, tab) {
  cy.get('[data-qa=topology-tabs]')
    .find(`[aria-posinset=${pages['tabs']['Canvas']}]`)
    .click();
});

Given('the "Topology" "Systems" Tab is selected', function(screen, tab) {
  cy.get('[data-qa=topology-tabs]')
    .find(`[aria-posinset=${pages['tabs']['Systems']}]`)
    .click();
});

Given('the "Topology" "Interfaces" Tab is selected', function(screen, tab) {
  cy.get('[data-qa=topology-tabs]')
    .find(`[aria-posinset=${pages['tabs']['Interfaces']}]`) // use the current pane set up file to identify the posinset for angular materials tab as data-qa cannot be used
    .click();
});
