const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user reloads the Radio page', function(usertype) {
  let wait = ['@GETRadios'];
  cy.reload();
  cy.wait(wait);
  cy.get('[data-qa=spinner]').should('not.be.visible');
});
