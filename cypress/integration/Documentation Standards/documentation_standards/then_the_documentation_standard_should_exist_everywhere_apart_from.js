const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the documentation standard {string} should exist with type {string} everywhere apart from {string}', function(
  doc_standard,
  type,
  components
) {
  doc_standard = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(doc_standard); //add the branch to the work package name
  cy.findDocumentationStandard(doc_standard, false)
    .find('tr :first')
    .click()
    .then(() => {
      cy.get('[data-qa=documentation-standards-details-name]').should('have.value', doc_standard);
      cy.get('[data-qa=documentation-standards-details-description]').should('have.value', doc_standard);
      cy.get('[data-qa=documentation-standards-details-type]').then(input => {
        expect(input[0].textContent).to.equal(type);
      });
    })
    .then(() => {
      cy.log(`Check that the ${components} (${components.split(',').length}) are unchecked`);
      cy.get('[data-qa=documentation-standards-details-form]')
        .find('[aria-checked=false]')
        .should('have.length', components.split(',').length + 1);
    })
    .then(() => {
      components.split(',').forEach(component => {
        cy.log(component);
        cy.get('mat-tree-node')
          .contains(component)
          .find('input')
          .should('have.attr', 'aria-checked', 'false');
      });
    });
});
