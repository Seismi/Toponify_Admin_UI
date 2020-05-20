const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the work package status should change to {string}', function(status) {
  cy.get(`[data-qa=work-packages-table]`) // get the work packages table
    .within(() => {
      // constrain commands to the table
      cy.get('tbody>tr') // get the highlighted rows
        .filter('.highlight')
        .within(() => {
          cy.get('td')
            .eq(2)
            .should('have.text', status); //the second cell should match the status parameter
        });
    });
});
