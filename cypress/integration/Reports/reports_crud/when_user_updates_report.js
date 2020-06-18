const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user updates the name to {string}, the description to {string}, the source system to {string}', function(
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

  cy.get('[data-qa=spinner]').should('not.be.visible');
  cy.get('[data-qa=reports-details-name]')
    .clear()
    .type(name)
    .should('have.value', name);
  cy.get('[data-qa=reports-details-description]')
    .clear()
    .type(description)
    .should('have.value', description);
  cy.get('[data-qa=reports-source-system-edit]').click();
  cy.selectDropDownNoClick('select-modal-search', system);

  cy.get('[data-qa=select-modal-confirm]').click();
});
