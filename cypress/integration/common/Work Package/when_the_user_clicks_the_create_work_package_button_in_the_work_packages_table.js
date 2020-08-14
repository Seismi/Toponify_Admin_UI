const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user clicks the create work package button in the work packages table', function(menu_item) {
  cy.get(`[data-qa=work-packages-create-new]`) // create a new work package
    .click()
    .wait(['@GETTeams']); // wait for the api routes
});
