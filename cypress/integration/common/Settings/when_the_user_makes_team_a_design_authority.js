const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the user makes the team {string} a design authority', function(email) {
  cy.get('[data-qa=settings-teams-details-edit]') // edit the teams details
    .click({ force: true }) // click the team details
    .then(() => {
      cy.get('[data-qa=settings-teams-details-design-authority]') // get the design authority toggle
        .find('label>div>input') // find the input
        .check({ force: true }); // check it
      cy.get('[data-qa=settings-teams-details-save]') // save the team details
        .click() // click
        .then(() => {
          cy.wait('@PUTTeam'); // wait for the put team api
        });
    });
});
