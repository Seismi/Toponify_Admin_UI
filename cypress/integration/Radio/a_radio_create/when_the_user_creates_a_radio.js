const { When } = require('cypress-cucumber-preprocessor/steps');

When(
  'the user creates a radio with title {string}, category {string}, status {string}, description {string} which is assigned to {string} and should be actioned by {string} and mitigation resolution {string}',
  (title, category, status, description, assigned, actioned, mitigation, severity) => {
    name = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(name);
    cy.writeRadioDetails(title, category, status, assigned, severity, 1, actioned, description, mitigation);
  }
);
