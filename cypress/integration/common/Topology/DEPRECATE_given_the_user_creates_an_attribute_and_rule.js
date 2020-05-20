import { When, Given, Then } from 'cypress-cucumber-preprocessor/steps';
//const pages = require('../../../../DEPRECATE_current_pane_set_up').website_structure.pages;

Given('DEPRECATE the user creates a new {string} called {string} with description {string}', function(
  attRule,
  name,
  description
) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); // append the branch name to the test work package to differentiate between branch test
  cy.get('[data-qa=topology-attributes-and-rules-table-create-new]')
    .click()
    .then(() => {
      createAttributeAndRule(name, description, attRule);
    });
});

When('DEPRECATE the user removes the {string} called {string}', function(attRule, name, description) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); // append the branch name to the test work package to differentiate between branch test
  cy.get(`[data-qa=topology-attributes-and-rules-table]`) // get the objectives table
    .find('table>tbody') // get the table body
    .contains('td', name) // get the objective
    .get(`[data-qa=topology-attributes-and-rules-table-delete]`) // find the move button
    .click()
    .then(() => {
      cy.get(`[data-qa=topology-delete-attribute-modal-confirm]`) // get the modal select
        .click()
        .then(() => {
          cy.get(`[data-qa=topology-attributes-and-rules-table]`) // get the objectives table
            .find('table>tbody') // get the table body
            .contains('td', name) // get the objective
            .should('not.exist');
        });
    });
});

When('DEPRECATE the user adds an existing {string} called {string}', function(attRule, name) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); // append the branch name to the test work package to differentiate between branch test
  cy.get('[data-qa=topology-attributes-and-rules-table-add-existing]')
    .click()
    .then(() => {
      cy.selectTableFirstRow(
        name,
        'topology-add-existing-attribute-quick-search',
        'topology-add-existing-attribute-modal-table'
      )
        .click()
        .then(() => {
          cy.get('[data-qa=topology-add-existing-attribute-modal-save]').click();
        });
    });
});

Then(
  'DEPRECATE the {string} called {string} with description {string} should exist in the attributes and rules table immediately',
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

Then(
  'DEPRECATE the {string} called {string} with description {string} should not exist in the attributes and rules table immediately',
  function(attRule, name, description) {
    name = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(name); // append the branch name to the test work package to differentiate between branch test
    cy.selectTableFirstRow(
      name,
      'topology-attributes-and-rules-table-quick-search',
      'topology-attributes-and-rules-table'
    ).should('not.exist');
  }
);

function DEPRECATEcreateAttributeAndRule(name, description, category) {
  cy.selectDropDownNoClick('rule-and-attribute-details-category', category)
    .then(() => {
      cy.get('[data-qa=rule-and-attribute-details-name]')
        .should('be.visible')
        .type(name);
    })
    .then(() => {
      cy.get('[data-qa=rule-and-attribute-details-description]')
        .should('be.visible')
        .type(description);
    })
    .then(() => {
      cy.get('[data-qa=rule-and-attribute-modal-save]')
        .click()
        .wait(['@POSTWorkPackagesNodesAttributes', '@POSTWorkPackageAttributes', '@GETWorkPackageNodeTags']);
    });
}
