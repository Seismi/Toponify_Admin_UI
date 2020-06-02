import { Then } from 'cypress-cucumber-preprocessor/steps';

Then(
  'the {string} called {string} with description {string} should exist in the attributes and rules table immediately',
  function(attRule, name, description) {
    name = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(name); // append the branch name to the test work package to differentiate between branch test
    cy.selectTableFirstRow(
      name,
      'topology-attributes-and-rules-table-quick-search',
      'topology-attributes-and-rules-table'
    ).should('exist');
  }
);
