const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user clicks the {string} button on the work package', function(action_button) {
  action_button = action_button === 'unarchive' ? 'archive' : action_button; // archive button is used for both archive and unarchive
  cy.get(`[data-qa=work-packages-${action_button}]`) // get the relevant button
    .click() // click it
    .then(() => {
      if (action_button === 'archive') {
        // if archiving
        cy.wait('@PUTWorkPackage'); // wait for work package put
      } else {
        cy.wait(`@POST${action_button}WorkPackage`); // wait for the relevant post action
      }
    });
});
