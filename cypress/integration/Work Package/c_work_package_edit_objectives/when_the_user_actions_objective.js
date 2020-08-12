import { When } from 'cypress-cucumber-preprocessor/steps';

When('the user clicks to {string} the create of the objective', function(button) {
  cy.get(`[data-qa=work-packages-objectives-modal-${button}]`) // get the correct button
    .click()
    .then(() => {
      if (button === 'confirm') {
        // if the create objective is confirmed wait for the required routes
        cy.wait(['@POSTworkPackageObjectives', '@POSTobjectives']);
        //cy.get('[data-qa=spinner]').should('not.be.visible')
      }
    });
});

When('the user clicks to {string} the move of the objective', function(button) {
  cy.get(`[data-qa=work-packages-move-objectives-modal-${button}]`) // find the correct work button
    .click()
    .then(() => {
      if (button === 'confirm') {
        cy.wait('@POSTworkPackageObjectives').wait('@DELETEworkPackageObjectives');
      } // wait for the required API routes to complete
    });
});

When('the user clicks to {string} the delete of the objective', function(button) {
  let action = button === 'confirm' ? 'yes' : 'no'; // determine the action
  cy.get(`[data-qa=delete-modal-${action}`) //get the correct button on the delete modal
    .click()
    .then(() => {
      if (button === 'confirm') cy.wait('@DELETEworkPackageObjectives'); // if the changes is confirmed, wait for the correct APIs
    });
});
