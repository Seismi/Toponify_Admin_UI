const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the user removes design authority from team {string}', function(email) {
  cy.get('[data-qa=settings-teams-details-edit]') //get the edit button
    .click({ force: true }) // click it
    .then(() => {
      cy.get('[data-qa=settings-teams-details-design-authority]') //get the design authority toggle
        .find('label>div>input') // find the input
        .uncheck({ force: true }); // uncheck the design authority
      cy.get('[data-qa=settings-teams-details-save]') // get the save button
        .click() // click it
        .then(() => {
          cy.wait('@PUTTeam'); // wait for the team api
        });
    });
});
