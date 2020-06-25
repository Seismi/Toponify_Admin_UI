const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user clicks the {string} button on the work package', function(action_button) {
  action_button = action_button === 'unarchive' ? 'archive' : action_button; // archive button is used for both archive and unarchive

  if (action_button === 'archive') {
    cy.get(`[data-qa=work-packages-${action_button}]`) // get the relevant button
      .click() // click it
      .wait(4000)
      .wait('@PUTWorkPackage')
      .wait('@GETArchiveWorkPackages')
      .then(xhr => {
        console.log(xhr);
      });
  } else {
    cy.get(`[data-qa=work-packages-${action_button}]`) // get the relevant button
      .click() // click it
      .wait(`@POST${action_button}WorkPackage`);
  }
});
