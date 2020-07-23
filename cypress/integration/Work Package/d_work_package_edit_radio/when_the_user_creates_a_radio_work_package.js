import { When, Then } from 'cypress-cucumber-preprocessor/steps';
const work_package_settings = require('../../common/Work Package/work_package_settings');

When(
  'the user creates a radio with title {string}, category {string}, status {string}, description {string} which is assigned to {string} and should be actioned by {string} and mitigation resolution {string} and have severity {int} and probability {int} against work package {string}',
  function(title, category, status, description, assigned, actioned, mitigation, severity, probability, work_package) {
    // and have severity {string} and probability (string)
    title = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(title); // append the branch to the name

    cy.get('[data-qa=work-packages-radio-table-add')
      .click()
      .wait('@GETRadios');
    cy.get('[data-qa=work-packages-radio-modal-new]')
      .click()
      .then(() => {
        cy.writeRadioDetails(
          title,
          category,
          status,
          assigned,
          severity,
          probability,
          actioned,
          description,
          mitigation
        );
        cy.get('[data-qa=radio-modal-save]')
          .click()
          .wait(['@POSTRadios', '@GETWorkPackage']);
      });
    cy.get('[data-qa=details-spinner]').should('not.be.visible');
  }
);
