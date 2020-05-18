import { When } from 'cypress-cucumber-preprocessor/steps';

When('the user removes the {string} called {string}', function(attRule, name, description) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); // append the branch name to the test work package to differentiate between branch test
  cy.get(`[data-qa=topology-attributes-and-rules-table]`) // get the objectives table
    .find('table>tbody') // get the table body
    .contains('td', name) // get the objective
    .get(`[data-qa=topology-attributes-and-rules-table-delete]`) // find the move button
    .click()
    .then(() => {
      cy.get(`[data-qa=topology-delete-attribute-modal-confirm]`) // get the modal select
        .click()
        .then(() => {
          cy.get(`[data-qa=topology-attributes-and-rules-table]`) // get the attributes and rules table
            .find('table>tbody') // get the table body
            .contains('td', name) // get the objective
            .should('not.exist');
        });
    });
});
