const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user updates the work package name to {string} and description to {string}', function(name, description) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); // prefix the name with the branch
  cy.get(`[data-qa=work-packages-edit]`) // get the edit button
    .click()
    .then(() => {
      cy.get(`[data-qa=work-packages-details-name]`)
        .clear({ force: true })
        .type(name)
        .should('have.value', name); // type in the name
      cy.get(`[data-qa=work-packages-details-description]`)
        .clear({ force: true })
        .type(description)
        .should('have.value', description); // type in the description
    });
});
