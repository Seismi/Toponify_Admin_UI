const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the radio {string} does not exist', radio => {
  radio = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(radio);
  cy.findRadio(radio).then($table => {
    cy.wait(['@POSTradiosAdvancedSearch.all'])
      .its('status')
      .should('eq', 200)
      .then(xhr => {
        if ($table[0].rows.length > 0) {
          Object.keys($table[0].rows).forEach(_ => {
            cy.deleteRadio(radio);
          });
        }
      });
  });
});
