import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('the documentation standard {string} does not exist', function(doc_standard) {
  doc_standard = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(doc_standard); //add the branch to the work package name
  cy.findDocumentationStandard(doc_standard, true, true).then($table => {
    if ($table[0].rows.length > 0) {
      //if rows are found
      Object.keys($table[0].rows).forEach(work_package => {
        //loop through the rows
        cy.deleteDocumentationStandard(doc_standard); //delete the work packages
      });
    }
  });
});
