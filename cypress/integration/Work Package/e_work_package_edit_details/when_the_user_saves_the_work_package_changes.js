const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user saves the work package changes', function() {
  cy.get(`[data-qa=work-packages-save]`)
    .click() // get and click the save button
    .wait('@PUTWorkPackage');
});
