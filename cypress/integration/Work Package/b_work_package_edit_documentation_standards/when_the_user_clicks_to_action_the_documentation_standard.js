import { When } from 'cypress-cucumber-preprocessor/steps';

When('the user clicks to {string} the valid change', function(action) {
  cy.get(`[data-qa=documentation-standards-table-${action}]`) // get the action button
    .click()
    .then(() => {
      cy.wait(['@PUTcustomPropertyValues']); // wait for the relevant apis
    });
});

When('the user clicks to {string} the invalid change', function(action) {
  cy.get(`[data-qa=documentation-standards-table-${action}]`) //
    .click();
});
