const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the documentation standard {string} should not be visible', function(doc_standard) {
  doc_standard = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(doc_standard); //add the branch to the work package name
  cy.get(`[data-qa=documentation-standards-table-quick-search]`) // search for the documentation standard
    .clear({ force: true })
    .type(doc_standard)
    .then(() => {
      cy.get('[data-qa=documentation-standards-card]').should('not.exist');
    });
});
