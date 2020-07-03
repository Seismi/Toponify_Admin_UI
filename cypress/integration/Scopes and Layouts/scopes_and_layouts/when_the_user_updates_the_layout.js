const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user updates the layout called {string} to be {string} against the scope called {string}', function(
  layout,
  newLayout,
  scope
) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // prefix the branch to scope
  newLayout = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(newLayout); // prefix the branch to scope
  layout = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(layout); // prefix the branch to scope
  cy.findScope(scope)
    .click()
    .then(() => {
      cy.selectRow('scopes-and-layouts-layout-table', layout)
        .click()
        .wait('@GETLayout')
        .then(() => {
          cy.get('[data-qa=scopes-and-layouts-layout-details-form]').within(() => {
            cy.get('[data-qa=scopes-and-layouts-edit]')
              .click()
              .then(() => {
                cy.get('[data-qa=scopes-and-layouts-details-name]')
                  .clear()
                  .type(newLayout)
                  .should('have.value', newLayout)
                  .then(() => {
                    cy.get('[data-qa=scopes-and-layouts-save]').click();
                  });
              });
          });
        });
    });
});
