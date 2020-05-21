const { When } = require('cypress-cucumber-preprocessor/steps');

When(
  'the user creates a radio with title {string}, category {string}, status {string}, description {string} which is assigned to {string} and should be actioned by {string} and mitigation resolution {string} and have severity {int} and probability {int}',
  (title, category, status, description, assigned, actioned, mitigation) => {
    name = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(name);
    cy.writeRadioDetails(title, category, status, assigned, 1, 2, actioned, description, mitigation);
  }
);
