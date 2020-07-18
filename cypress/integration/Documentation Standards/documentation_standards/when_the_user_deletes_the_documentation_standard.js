import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('the user deletes the documentation standard {string}', function(doc_standard) {
  doc_standard = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(doc_standard); //add the branch to the work package name

  cy.findDocumentationStandard(doc_standard, false)
    .contains('td', doc_standard)
    .click()
    .get('[data-qa=documentation-standards-delete]')
    .click()
    .wait('@GETCustomProperties*');
});
