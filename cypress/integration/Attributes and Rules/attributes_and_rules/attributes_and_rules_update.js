import { And } from 'cypress-cucumber-preprocessor/steps';

And('the user updates category {string}, title {string}, description {string}', (category, title, description) => {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name);
  cy.assertAttributesForm(category, title, description);
});

And('the user cancel update', () => {
  cy.get('[data-qa=attributes-and-rules-cancel]').click();
});

And('the user confirm update', () => {
  cy.get('[data-qa=attributes-and-rules-save]')
    .click()
    .wait('@PUTAttributeAndRule');
});

And('the attribute {string} should exist in the table', attr => {
  attr = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(attr);
  cy.get('[data-qa=rules-and-attributes-quick-search]')
    .clear()
    .paste(attr);
  cy.get('[data-qa=rules-and-attributes-table]').find('table>tbody');
});
