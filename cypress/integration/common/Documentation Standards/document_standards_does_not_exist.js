import { And } from 'cypress-cucumber-preprocessor/steps';

And('the document standard {string} does not exist', title => {
  title = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(title);
  cy.findDocumentStandard(title).then($table => {
    if ($table[0].rows.length > 0) {
      Object.keys($table[0].rows).forEach(_ => {
        cy.deleteDocumentStandard(title);
      });
    }
  });
});
