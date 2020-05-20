const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the user {string} should be a member of team {string}', function(user, team) {
  cy.get('[data-qa=settings-teams-members-table]') // get the members table
    .find('table>tbody') // find the table body
    .contains('td', user) // find the cell that contains the user
    .should('exist'); // assert that it exists
});
