const { When } = require('cypress-cucumber-preprocessor/steps');

When('I ask to log in as usertype {string}', function(usertype) {
  cy.login(usertype); // use the login command (stored in command.js) to log in as user type
});
