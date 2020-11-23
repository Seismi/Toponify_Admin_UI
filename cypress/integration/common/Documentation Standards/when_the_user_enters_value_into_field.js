import { When } from 'cypress-cucumber-preprocessor/steps';

When('the user enters number {float} into field {string}', function(value, doc_standard) {
  cy.addDocStandard(value, doc_standard);
});

When('the user enters number {int} into field {string}', function(value, doc_standard) {
  cy.addDocStandard(value, doc_standard);
});

When('the user enters string {string} into field {string}', function(value, doc_standard) {
  cy.addDocStandard(value, doc_standard);
});

When('the user enters date {} into field {string}', function(value, doc_standard) {
  cy.addDocStandardDate(value, doc_standard);
});

When('the user enters boolean {} into field {string}', function(value, doc_standard) {
  cy.addDocStandardBoolean(value, doc_standard);
});
