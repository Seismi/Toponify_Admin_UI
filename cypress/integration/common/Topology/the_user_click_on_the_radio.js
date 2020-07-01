const { And } = require('cypress-cucumber-preprocessor/steps');

And('the user clicks on the radio', () => {
  cy.get('[data-qa=related-radio-table-open]')
    .click({ force: true })
    .wait(['@GETRadios', '@POSTradiosAdvancedSearch']);
});
