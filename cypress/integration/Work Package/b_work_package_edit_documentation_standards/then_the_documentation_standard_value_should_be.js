const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the value of {string} should be {float}', function(doc_standard, value) {
  documentationStandardTest(doc_standard, value);
});

Then('the value of {string} should be {int}', function(doc_standard, value) {
  documentationStandardTest(doc_standard, value);
});

Then('the value of {string} should be {string}', function(doc_standard, value) {
  documentationStandardTest(doc_standard, value);
});

Then('the value of {string} should be {}', function(doc_standard, value) {
  documentationStandardTest(doc_standard, value);
});

function documentationStandardTest(doc_standard, value) {
  //Tests the value in a documentation standard test
  doc_standard = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(doc_standard); // prefix the name with branch
  cy.get(`[data-qa=documentation-standards-table-quick-search]`) // search for the documentation standard
    .clear()
    .type(doc_standard);
  cy.get(`[data-qa=work-packages-documentation-standards-table]`) //get the table
    .find('table>tbody') // find the table body
    .contains('tr', doc_standard) // row that contains documentation standard
    .find(`td`) //check if a cell has value
    .eq(1)
    .shouldHaveTrimmedText(value); // trims leading and trailing spaces for strings
}
