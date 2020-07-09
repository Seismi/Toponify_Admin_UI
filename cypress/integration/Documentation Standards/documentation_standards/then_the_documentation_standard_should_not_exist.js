const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the document standard {string} should not exist in the documentation standards table', function(doc_standard) {
  doc_standard = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(doc_standard); //add the branch to the work package name
  cy.findDocumentationStandard(doc_standard, false).then(table => {
    expect(table[0].rows.length).to.equal(0);
  });
});
