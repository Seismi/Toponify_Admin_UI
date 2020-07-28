const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the documentation standard {string} should be visible', function(doc_standard) {
  doc_standard = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(doc_standard); //add the branch to the work package name
  cy.get(`[data-qa=documentation-standards-table-quick-search]`) // search for the documentation standard
    .clear({ force: true })
    .type(doc_standard)
    .then(() => {
      cy.get('[data-qa=work-packages-documentation-standards-table]')
        .find('table>tbody') //find the body
        .contains('tr', doc_standard) // and the row which contains
        .should('exist');
    });
});
