import { Then } from 'cypress-cucumber-preprocessor/steps';

Then(
  'the radio with the title {string} should have the category {string}, status {string}, description {string}, assigned to {string}, be actioned by {string}, with mitigation resolution {string} and have severity {int} and probability {int}',
  (title, category, status, description, assigned, actioned, mitigation) => {
    title = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(title); // prefix the branch to objective
    cy.assertRadioDetails(title, category, status, assigned, 1, 2, actioned, description, mitigation);
  }
);
