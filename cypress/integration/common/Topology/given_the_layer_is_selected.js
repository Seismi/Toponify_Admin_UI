const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the {string} layer is selected', function(layer) {
  cy.get(`[data-qa=header-layer-dropdown]`)
    .click()
    .wait(['@GETNodesQuery', '@GETNodeLinksQuery'])
    .get('mat-option')
    .contains(layer)
    .click({ force: true })
    .get(`[data-qa=header-layer-dropdown]`)
    .type('{esc}');
});
