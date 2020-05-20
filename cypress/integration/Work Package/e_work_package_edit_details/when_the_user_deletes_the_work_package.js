const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user deletes the work package {string}', function() {
  // when the user delete
  cy.get(`[data-qa=work-packages-delete]`) // get delete button
    .click()
    .then(() => {
      cy.get('[data-qa=delete-modal-yes]') // get and click delete modal
        .click()
        .wait('@DELETEWorkPackage'); // wait for delete API
    });
});
