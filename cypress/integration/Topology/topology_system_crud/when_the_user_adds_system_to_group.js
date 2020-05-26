const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the grouped info table should contain {string}', function(group) {
  cy.get('[data-qa=object-details-grouped-in-table]')
    .contains(group)
    .should('exist');
});
