const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user saves the work package', function(name, description, baseline, owner) {
  cy.get(`[data-qa=work-packages-modal-save]`) // get the modal save button
    .click()
    .then(() => {
      cy.wait('@POSTWorkPackage'); //wait for the route
    });
});
