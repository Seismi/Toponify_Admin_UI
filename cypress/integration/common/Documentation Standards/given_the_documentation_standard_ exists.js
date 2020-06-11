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
        cy.createDocumentationStandard(doc_standard, type, component); // create the documentation standard
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
                    cy.createDocumentationStandard(doc_standard, type, component); //create the documentation standard
                  });
              });
          });
      }
    });
});
