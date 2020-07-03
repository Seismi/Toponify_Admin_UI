const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user creates a new report with the name {string}, description {string} and selects system {string}', function(
  name,
  description,
  system
) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); // prefix name with branch
  system = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(system); // prefix name with branch

  cy.createReport(name, description, system);
});
