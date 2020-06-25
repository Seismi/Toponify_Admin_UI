const { And } = require('cypress-cucumber-preprocessor/steps');

And('the user cancels the radio creation', () => {
  cy.get('[data-qa=radio-modal-cancel]').click();
});

And('the user confirm the radio creation', () => {
  cy.get('[data-qa=radio-modal-save]')
    .click()
    .wait(['@POSTRadios', '@GETNodesWorkPackageQuery.all', '@GETNodeLinksWorkPackageQuery.all']);
});
