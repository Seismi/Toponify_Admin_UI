const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user updates the scope called {string} to have name {string} and filtering components {string}', function(
  scope,
  newScope,
  component
) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // prefix the branch to scope
  newScope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(newScope); // prefix the branch to scope
  cy.findScope(scope)
    .click()
    .wait(['@GETScope', '@GETLayout'])
    .then(() => {
      cy.get('[data-qa=scopes-and-layouts-edit]')
        .click()
        .then(() => {
          cy.get('[data-qa=scopes-and-layouts-details-name]')
            .clear()
            .paste(newScope)
            .should('have.value', newScope);
        })
        .then(() => {
          cy.get('[data-qa=scopes-and-layouts-save]')
            .click()
            .wait('@PUTLayoutScope');
        });
    });
});
