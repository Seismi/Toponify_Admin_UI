const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the user adds user {string} to team {string}', function(user, team) {
  cy.get(`[data-qa=settings-teams-members-table-add]`).then(() => {});
});
