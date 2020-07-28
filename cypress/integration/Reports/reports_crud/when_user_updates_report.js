const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user updates the name to {string}, the description to {string}', function(name, description) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); // prefix name with branch

  cy.get('[data-qa=spinner]').should('not.be.visible');
  cy.get('[data-qa=reports-details-name]')
    .clear({ force: true })
    .type(name)
    .should('have.value', name);

  cy.get('[data-qa=reports-details-description]')
    .clear({ force: true })
    .type(description)
    .should('have.value', description);
});
