const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user reloads the Documentation Standards page', function(usertype) {
  let wait = ['@GETCustomProperties', '@GETCustomProperties*'];
  cy.reload().wait(wait);
});
