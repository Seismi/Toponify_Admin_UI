import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('the details pane should reflect the name {string}, description {string} and and the system {string}', function(
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

  cy.get('[data-qa=reports-details-name]').should('have.value', name);
  cy.get('[data-qa=reports-details-description]').should('have.value', description);
  //  cy.selectDropDownNoClick('reports-details-system', system);
});
