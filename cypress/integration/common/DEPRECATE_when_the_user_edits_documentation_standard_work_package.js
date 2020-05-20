import { When, Then } from 'cypress-cucumber-preprocessor/steps';

function DEPRECATE_createAttributeAndRule(name, description, category) {
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
