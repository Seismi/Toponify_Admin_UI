import { When } from 'cypress-cucumber-preprocessor/steps';

When('the user creates a new {string} called {string} with description {string}', (attRule, name, description) => {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name);
  cy.get('[data-qa=rules-and-attributes-create-new]')
    .click()
    .then(() => {
      cy.createAttributeAndRule(name, description, attRule);
      cy.get('[data-qa=rule-and-attribute-modal-save]')
        .click()
        .wait(['@POSTWorkPackageAttributes']);
    });
});

When(
  'the user creates a new {string} called {string} with description {string} and cancels',
  (attRule, name, description) => {
    name = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(name);
    cy.get('[data-qa=rules-and-attributes-create-new]')
      .click()
      .then(() => {
        cy.createAttributeAndRule(name, description, attRule);
        cy.get('[data-qa=rule-and-attribute-modal-cancel]').click();
      });
  }
);
