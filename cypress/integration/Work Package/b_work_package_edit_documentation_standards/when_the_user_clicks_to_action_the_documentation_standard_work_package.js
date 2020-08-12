import { When } from 'cypress-cucumber-preprocessor/steps';

When('the user clicks to {string} the valid change', function(action) {
  let wait_for = ['@PUTcustomPropertyValues'];
  cy.saveDocumentationChange(action, wait_for);
});

When('the user clicks to {string} the invalid change', function(action) {
  cy.get(`[data-qa=documentation-standards-table-${action}]`) //
    .click();
});
