import { Then, And } from 'cypress-cucumber-preprocessor/steps';

And(
  'the user creates a documentation standard with title {string}, type {string} and component type {string}',
  (title, type, componentType) => {
    title = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(title);
    cy.createDocumentationStandard(title, type, componentType);
  }
);

And('the user checks if documentation standards exist with title {string}', title => {
  title = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(title);
  cy.selectDetailsPaneTab(4).then(() => {
    cy.get(`[data-qa=documentation-standards-table-quick-search]`)
      .clear()
      .type(title)
      .then(() => {
        cy.get('[data-qa=documentation-standards-card]')
          .find('.name')
          .contains(title)
          .should('exist');
      });
  });
});

And('the user updates the filter to find radio with title {string}', title => {
  title = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(title);
  cy.findRadio(title)
    .click()
    .wait('@GETRadio');
});
