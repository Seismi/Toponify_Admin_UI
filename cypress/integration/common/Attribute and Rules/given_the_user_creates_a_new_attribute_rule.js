import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('the user creates a new {string} called {string} with description {string}', function(
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

function createAttributeAndRule(name, description, category) {
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
