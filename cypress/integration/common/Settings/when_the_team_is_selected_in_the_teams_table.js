const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the team {string} is selected in the teams table', function(email) {
  cy.selectTeam(email) // select the team in the teams table
    .click() // click the team
    .then(() => {
      cy.wait('@GETTeam', { requestTimeout: 20000, responseTimeout: 20000 }); // wait for team api
    });
});
