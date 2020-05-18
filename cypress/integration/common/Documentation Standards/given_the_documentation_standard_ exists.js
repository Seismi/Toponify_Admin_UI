import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('the documentation standard {string} exists with type {string} against {string} component', function(
  doc_standard,
  type,
  component
) {
  doc_standard = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(doc_standard); //add the branch to the work package name
  cy.get(`[data-qa=documentation-standards-table]`)
    .find('table>tbody>tr') //find the rows
    .find('td:first') // find the first cell
    .invoke('text') //get the text
    .then(rows => {
      if (rows.indexOf(doc_standard) === -1) {
        // if the row does not contain the documentation standard
        createDocumentationStandard(doc_standard, type, component); // create the documentation standard
      } else {
        cy.selectRow('documentation-standards-table', doc_standard) // select the documentation standard
          .then(() => {
            cy.get(`[data-qa=documentation-standards-delete]`) //get the delete button
              .click() // click it
              .then(() => {
                cy.get('[data-qa=delete-modal-yes]') // get the delete modal button
                  .click()
                  .then(() => {
                    cy.wait('@DELETECustomProperties'); // delete the documentation standard
                    createDocumentationStandard(doc_standard, type, component); //create the documentation standard
                  });
              });
          });
      }
    });
});

function createDocumentationStandard(doc_standard, type, component) {
  // Creates a documentation standard
  cy.get('[data-qa=documentation-standards-create-new]')
    .click()
    .then(() => {
      cy.get('[data-qa=documentation-standards-details-name]').type(doc_standard); // enter the name
      cy.get('[data-qa=documentation-standards-details-description]').type(doc_standard); //enter the description
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
