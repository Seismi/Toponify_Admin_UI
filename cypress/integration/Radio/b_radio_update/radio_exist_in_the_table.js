const { When } = require('cypress-cucumber-preprocessor/steps');

When(
  'the radio {string} exists with title {string}, category {string}, status {string}, description {string} which is assigned to {string} and should be actioned by {string} and mitigation resolution {string} and have severity {int} and probability {int}',
  (title, radio) => {
    title = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(title);
    cy.findRadio(name).wait('@GETRadios');
    cy.selectRow('radio-table', radio).wait('@GETRadio');
  }
);
