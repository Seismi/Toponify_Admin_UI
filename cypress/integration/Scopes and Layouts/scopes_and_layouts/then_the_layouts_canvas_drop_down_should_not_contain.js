const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the layouts canvas drop down should not contain {string} against scope {string}', function(layout, scope) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // prefix the branch to scope
  layout = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(layout); // prefix the branch to scope
  let wait = ['@GETScope', '@GETLayout', '@GETNodesScopeQuery'];
  cy.selectDropDownWaitFor('header-scopes-dropdown', scope, wait).then(() => {
    cy.get('[data-qa=spinner]').should('not.be.visible');
    cy.get('smi-layout-actions')
      .find('[data-qa=topology-layout-actions-layout-dropdown]') // get the scopes table
      .contains('mat-option', layout)
      .should('not.exist');
  });
});
