const { When } = require('cypress-cucumber-preprocessor/steps');

When(
  'the user updates the documentation standard {string} to have name {string} with description {string}, type {string} and removes the {string} component',
  function(doc_standard, doc_standard_new, description, type, components) {
    doc_standard = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(doc_standard); //add the branch to the work package name
    doc_standard_new = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(doc_standard_new); //add the branch to the work package name
    cy.findDocumentationStandard(doc_standard)
      .click()
      .wait('@GETCustomProperties*')
      .then(() => {
        cy.get(`[data-qa=documentation-standards-edit]`)
          .click()
          .then(() => {
            cy.get('[data-qa=documentation-standards-details-name]')
              .clear()
              .type(doc_standard_new);
            cy.get('[data-qa=documentation-standards-details-description]')
              .clear()
              .type(doc_standard_new);
            cy.get(`[data-qa=documentation-standards-details-type]`) // get the type drop down
              .click()
              .get('mat-option')
              .contains(type) // get the mat-option that contains type
              .click({ force: true }); // click
          });
      })
      .then(() => {
        components.split(',').forEach(component => {
          cy.get('smi-document-standards-levels') // get the levels
            .get('mat-tree-node') // get the tree node.  Everywhere is a special case and is a mat-check-box
            .contains(component.trim()) // which contains the component
            .click();
        });
      });
  }
);
