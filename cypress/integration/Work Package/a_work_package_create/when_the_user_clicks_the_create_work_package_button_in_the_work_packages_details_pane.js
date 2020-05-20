const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user clicks the create work package button in the work packages details pane', function(menu_item) {
  cy.get(`[data-qa=right-hand-side-create-new]`) //click the create new in the details pane
    .click();
});
