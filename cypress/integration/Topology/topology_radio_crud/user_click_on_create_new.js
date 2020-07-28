const { And } = require('cypress-cucumber-preprocessor/steps');

And('the user click on create new radio button', () => {
  cy.get('[data-qa=related-radio-table-raise-new]').click();
});
