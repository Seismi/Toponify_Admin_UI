const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the value of {string} should be {float}', function(doc_standard, value) {
  cy.documentationStandardTest(doc_standard, value, 'reports-documentation-standards-table');
});

Then('the value of {string} should be {int}', function(doc_standard, value) {
  cy.documentationStandardTest(doc_standard, value, 'reports-documentation-standards-table');
});

Then('the value of {string} should be {string}', function(doc_standard, value) {
  cy.documentationStandardTest(doc_standard, value, 'reports-documentation-standards-table');
});

Then('the value of {string} should be {}', function(doc_standard, value) {
  cy.documentationStandardTest(doc_standard, value, 'reports-documentation-standards-table');
});
