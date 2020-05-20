import { When } from 'cypress-cucumber-preprocessor/steps';

When('the user adds an existing {string} called {string}', function(attRule, name) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); // append the branch name to the test work package to differentiate between branch test
  cy.get('[data-qa=topology-attributes-and-rules-table-add-existing]')
    .click()
    .then(() => {
      cy.selectTableFirstRow(
        value,
        'topology-add-existing-attribute-quick-search',
        'topology-add-existing-attribute-modal-table'
      )
        .click()
        .then(() => {
          cy.get('[data-qa=topology-add-existing-attribute-modal-save]').click();
        });
    });
});
