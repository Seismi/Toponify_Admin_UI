import { When } from 'cypress-cucumber-preprocessor/steps';

When('the user removes the scope {string} from the component', function(scope) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // prefix the objective with the branch
  cy.get(`[data-qa=topology-scopes-table]`) // get the objectives table
    .find('table>tbody') // the table body
    .contains('td', scope) // find the objective
    .get(`[data-qa=topology-scopes-table-delete]`) //get the delete button
    .click(); // click
});
