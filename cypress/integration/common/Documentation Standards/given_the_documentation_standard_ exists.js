import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('the documentation standard {string} exists with type {string} against {string} component', function(
  doc_standard,
  type,
  component
) {
  doc_standard = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(doc_standard);
  cy.findDocumentStandard(doc_standard).then($table => {
    if ($table[0].rows.length > 0) {
      Object.keys($table[0].rows).forEach(_ => {
        cy.deleteDocumentStandard(doc_standard);
      });
    }
  });
});

function createDocumentationStandard(doc_standard, type, component) {
  // Creates a documentation standard
  cy.get('[data-qa=documentation-standards-create-new]')
    .click()
    .then(() => {
      cy.get('[data-qa=documentation-standards-details-name]')
        .type(doc_standard)
        .should('have.value', doc_standard); // enter the name
      cy.get('[data-qa=documentation-standards-details-description]')
        .type(doc_standard)
        .should('have.value', doc_standard); //enter the description
      cy.root(); // return to root
      cy.get(`[data-qa=documentation-standards-details-type]`) // get the type drop down
        .click()
        .get('mat-option')
        .contains(type) // get the mat-option that contains type
        .click({ force: true }); // click
      cy.get('smi-document-standards-levels') // get the levels
        .get('mat-tree-node') // get the tree node
        .contains(component) // which contains the component
        .click();
      cy.get('[data-qa=documentation-standards-modal-save]') // save the documentation standard
        .click()
        .then(() => {
          cy.wait('@POSTCustomProperties'); //wait for the API
        });
    }); //click the create new documentations standard button
}
