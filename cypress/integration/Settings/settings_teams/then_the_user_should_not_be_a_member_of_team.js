const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the user {string} should not be a member of team {string}', function(user, team) {
  cy.get('[data-qa=settings-teams-members-table]') //get the table
    .find('table>tbody') // find the table body
    .contains('td', user) // a cell with user
    .should('not.exist'); //should not exist
});
