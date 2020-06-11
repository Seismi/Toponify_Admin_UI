import { Then, And } from 'cypress-cucumber-preprocessor/steps';

Then('the user goes to Documentation Standards pages', () => {
  cy.get('[data-qa=main-menu-open]')
    .click()
    .then(() => {
      cy.get('[data-qa=main-menu-documentation-standards]')
        .click()
        .wait('@GETCustomProperties');
    });
});

And('the document standard {string} does not exist', title => {
  cy.findDocumentStandard(title).then($table => {
    if ($table[0].rows.length > 0) {
      Object.keys($table[0].rows).forEach(_ => {
        cy.deleteDocumentStandard(title);
      });
    }
  });
});

And(
  'the user creates a documentation standard with title {string}, type {string} and component type {string}',
  (title, type, componentType) => {
    title = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(title);
    cy.createDocumentationStandard(title, type, componentType);
  }
);

And('the user goes back to radio page', () => {
  cy.get('[data-qa=main-menu-open]')
    .click()
    .then(() => {
      cy.get('[data-qa=main-menu-radios]')
        .click()
        .wait(['@GETRadios', '@GETNodes', '@GETRadioViews']);
    });
});

And('the user checks if documentation standards exist with title {string}', title => {
  cy.selectDetailsPaneTab(4).then(() => {
    cy.get('[data-qa=radio-documentation-standards-table]')
      .find('table>tbody')
      .get('td')
      .contains(title);
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
