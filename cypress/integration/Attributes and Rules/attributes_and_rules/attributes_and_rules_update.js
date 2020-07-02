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

And('the user checks if attribute {string} {string} exist in the table', (attr, exist) => {
  attr = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(attr);
  cy.get('[data-qa=rules-and-attributes-quick-search]')
    .clear()
    .type(attr);
  if (exist === 'not') {
    cy.get('[data-qa=rules-and-attributes-table]').find('table>tbody').length > 0;
  } else {
    cy.get('[data-qa=rules-and-attributes-table]').find('table>tbody');
  }
});
