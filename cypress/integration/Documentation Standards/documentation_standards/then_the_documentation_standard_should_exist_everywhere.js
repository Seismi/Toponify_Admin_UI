const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the documentation standard {string} should exist with type {string} everywhere', function(
  doc_standard,
  type,
  component
) {
  doc_standard = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(doc_standard); //add the branch to the work package name
  cy.findDocumentationStandard(doc_standard)
    .contains(doc_standard)
    .should('exist');
  cy.get(`[data-qa=documentation-standards-table]`) // get the work packages table
    .find('table>tbody')
    .find('tr :first')
    .click()
    .then(() => {
      cy.get('[data-qa=documentation-standards-details-name]').should('have.value', doc_standard);
      cy.get('[data-qa=documentation-standards-details-description]').should('have.value', doc_standard);
      cy.get('[data-qa=documentation-standards-details-type]').then(input => {
        expect(input[0].textContent).to.equal(type);
      });
      cy.log(`Check that the all tree nodes in "Component Types" remain checked`);
      cy.get('[data-qa=documentation-standards-details-form]')
        .find('[aria-checked=false]')
        .should('not.exist');
    });
});
