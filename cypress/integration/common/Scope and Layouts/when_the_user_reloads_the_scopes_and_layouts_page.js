const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user reloads the scopes and layouts page', function(usertype) {
  let wait = ['@GETScopes', '@GETMyProfile'];
  cy.reload().wait(wait);
});
