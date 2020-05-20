const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the team {string} exists with name {string}', function(name, description) {
  cy.get('[data-qa=settings-teams-quick-search]') //grab the teams search
    .clear() //clear contents
    .type(name)
    .then(() => {
      // type the team name
      cy.get(`[data-qa=settings-teams-table]`)
        .find('table>tbody')
        .then($table => {
          //get the teams table
          if ($table[0].rows.length === 0) {
            // if no rows were returned by the table
            teamDetails('settings-teams-create-new', name, description, false, 'settings-teams-modal-save'); // create new team
          } else {
            // if rows returned
            cy.get(`[data-qa=settings-teams-table]`)
              .find('table>tbody>tr :first')
              .click()
              .then(() => {
                //select the team
                cy.wait(['@GETTeam']); // wait for the api to return the team
                teamDetails('settings-teams-details-edit', name, description, false, 'settings-teams-details-save'); //update the teams details
              });
          }
        });
    });
});

function teamDetails(editButton, name, description, design_authority, saveButton) {
  cy.get(`[data-qa=${editButton}]`)
    .click({ force: true })
    .then(() => {
      // grab the correct edit button
      cy.get(`[data-qa=settings-teams-details-name]`)
        .clear()
        .type(name); //clear and type team name
      cy.get(`[data-qa=settings-teams-details-description]`)
        .clear()
        .type(description); //clear and type description
      cy.get('[data-qa=settings-teams-details-design-authority]')
        .find('label>div>input')
        .uncheck({ force: true }); // do not make design authority
      cy.get(`[data-qa=${saveButton}]`)
        .click()
        .then(() => {
          // find and click the save button
          cy.wait('@PUTTeam'); // wait for the PUT team to finish
        });
    });
}
