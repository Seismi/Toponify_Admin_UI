const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the visible buttons in the detail pane should change to be {string}', function(buttons) {
  buttons
    .split(',') // split the buttons parameter into an array
    .forEach(button => {
      // for each button
      cy.get('.mat-button-wrapper')
        .contains(button)
        .should('be.visible'); // assert that it should be visible
    });
});
