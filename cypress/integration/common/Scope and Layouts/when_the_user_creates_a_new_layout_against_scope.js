const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user creates a new layout called {string} against the scope called {string}', function(layout, scope) {
  layout = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(layout); // prefix the branch to scope
  cy.get('[data-qa=scopes-and-layouts-layout-table]')
    .find('[data-qa=scopes-and-layouts-create-new]')
    .click()
    //        .wait('@GETNotifications')
    .then(() => {
      cy.get('smi-scope-and-layout-modal')
        .find('[data-qa=scopes-and-layouts-details-name]')
        .type(layout)
        .then(() => {
          cy.get('[data-qa=scopes-and-layouts-modal-save]')
            .click()
            .wait(['@GETLayout', '@POSTLayouts', '@PUTLayoutScope']);
        });
    });
});
