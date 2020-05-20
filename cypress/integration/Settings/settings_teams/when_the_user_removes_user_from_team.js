const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user removes user {string} from team {string}', function(user, team) {
  cy.get(`[data-qa=settings-teams-members-table]`)
    .find('table>tbody')
    .contains('tr', user)
    .find(`[data-qa=settings-teams-members-table-delete]`)
    .click()
    .then(() => {
      cy.get('[data-qa=delete-modal-yes]')
        .click()
        .then(() => {
          //cy.wait()
        }); //TODO click on the save button. Chase Ed
    });
});
