import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('the work package called {string} should exist in the work packages table', function(name) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); // prefix name with branch
  cy.get(`[data-qa=work-packages-quick-search]`) //get the quick search
    .clear({ force: true }) //clear it
    .type(name)
    .should('have.value', name); // type the name
  cy.get(`[data-qa=work-packages-table]`) //get the work package tables
    .find('table>tbody') // get the table body
    .contains('td', name) // and the cell which contains name
    .should('be.visible'); // check it is visible
});
