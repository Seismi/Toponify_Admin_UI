const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user clicks on the scopes component tab', function(layout, scope) {
  layout = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(layout); // prefix the branch to scope
  cy.get('[data-qa=scopes-and-layouts-tabs]').within(() => {
    cy.get('[aria-posinset=2]').click();
  });
});
