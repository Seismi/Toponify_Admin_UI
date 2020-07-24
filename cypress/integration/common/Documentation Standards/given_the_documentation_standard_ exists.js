import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('the documentation standard {string} exists with type {string} against {string} component', function(
  doc_standard,
  type,
  component
) {
  doc_standard = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(doc_standard);
  cy.findDocumentationStandard(doc_standard, true)
    .then($table => {
      if ($table[0].rows.length > 0) {
        Object.keys($table[0].rows).forEach(_ => {
          cy.deleteDocumentStandard(doc_standard);
        });
      }
    })
    .then(() => {
      cy.createDocumentationStandard(doc_standard, type, component);
    });
});
