const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user reloads the scopes and layouts page', function(usertype) {
  let wait = ['@GETScopes'];
  cy.reload().wait(wait);
});
