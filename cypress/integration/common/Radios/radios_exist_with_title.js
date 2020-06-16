import { When } from 'cypress-cucumber-preprocessor/steps';

When(
  'the radio {string} exists with title {string}, category {string}, status {string}, description {string} which is assigned to {string} and should be actioned by {string} and mitigation resolution {string} and have severity {int} and probability {int}',
  radio => {
    radio = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(radio);
    cy.selectRow('radio-table', radio);
  }
);
