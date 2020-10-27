import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('the user creates relates to with work package {string} and {string} component', (workpackage, component) => {
  workpackage = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(workpackage);
  component = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(component);
  cy.get('[data-qa=radio-relates-to-add]').click();
  cy.selectDropDownNoClick('radio-associate-modal-work-package', workpackage).wait('@GETNodesQuery');
  cy.get('[data-qa=radio-associate-modal-components-spinner]').should('not.be.visible');
  cy.get('[data-qa=radio-associate-modal-components-search]')
    .click()
    .type(component)
    .get('mat-option')
    .contains(component)
    .should('exist')
    .click({ force: true })
    .then(() => {
      cy.get('[data-qa=radio-associate-modal-confirm]')
        .click()
        .wait(['@POSTWorkPackageNodeRadios', '@GETRadio', '@GETRadioTags']);
      cy.get('[data-qa=radio-details-spinner]').should('not.be.visible');
    });
});
