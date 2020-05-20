import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('the user deletes the {string} objective', function(objective) {
  objective = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(objective); // prefix the objective with the branch
  cy.get(`[data-qa=work-packages-objectives-table]`) // get the objectives table
    .find('table>tbody') // the table body
    .contains('td', objective) // find the objective
    .get(`[data-qa=work-packages-objectives-table-delete]`) //get the delete button
    .click(); // click
});
