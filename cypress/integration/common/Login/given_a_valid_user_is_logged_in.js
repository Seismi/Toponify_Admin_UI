const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('a valid user is logged in', function() {
  cy.login('validuser').then(() => {
    // custom command used to login stored in command.js
    cy.url().should('contain', '/home'); // assert that the home page is shown
  });
});
