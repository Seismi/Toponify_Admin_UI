const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user deletes the layout called {string} against the scope called {string}', function(layout, scope) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // prefix the branch to scope
  layout = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(layout); // prefix the branch to scope
  cy.findScope(scope)
    .click()
    .then(() => {
      cy.selectRow('scopes-and-layouts-layout-table', layout)
        .click()
        .then(() => {
          cy.get('[data-qa=scopes-and-layouts-layout-details-form]')
            .within(() => {
              cy.get('[data-qa=scopes-and-layouts-delete]').click();
            })
            .then(() => {
              cy.get('[data-qa=delete-modal-yes]')
                .click()
                .wait(['@DELETELayout', '@PUTLayoutScope']);
            });
        });
    });
});
