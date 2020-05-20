const { Then } = require('cypress-cucumber-preprocessor/steps');
Then('the layouts canvas drop down should contain {string} against scope {string}', function(layout, scope) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // prefix the branch to scope
  layout = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(layout); // prefix the branch to scope
  cy.selectDropDown('header-scopes-dropdown', scope).then(() => {
    cy.get('smi-layout-actions')
      .find('[data-qa=topology-layout-actions-layout-dropdown]') // get the scopes table
      .click()
      //.wait()[]
      .then(() => {
        cy.root()
          .contains('mat-option', layout)
          .should('exist')
          .type('{esc}');
      });
  });
});
