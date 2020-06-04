import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('the user deletes the documentation standard {string}', function(doc_standard) {
  doc_standard = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(doc_standard); //add the branch to the work package name

  cy.selectTableFirstRow(doc_standard, 'documentation-standards-quick-search', 'documentation-standards-table')
    .click()
    .wait('@GETCustomProperties*')
    .get('[data-qa=documentation-standards-delete]')
    .click();
});
