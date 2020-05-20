const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the team {string} should be a design authority', function(email) {
  cy.get('[data-qa=settings-teams-details-design-authority]') //asert that the design authority is checked
    .find('label>div>input')
    .should('be.checked');
});
