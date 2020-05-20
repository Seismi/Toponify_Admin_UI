const { When } = require('cypress-cucumber-preprocessor/steps');

When(
  'the user creates a radio with title {string}, category {string}, status {string}, description {string} which is assigned to {string} and should be actioned by {string} and mitigation resolution {string}',
  (title, category, status, description, assigned, actioned, mitigation, severity) => {
    name = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(name);
    cy.get('smi-radio-modal').within(() => {
      cy.get(`[data-qa=radio-detail-title]`).type(title);
      cy.selectDropDown('radio-detail-category', category);
      cy.selectDropDown('radio-detail-status', status);
      cy.type_ckeditor('[data-qa=radio-detail-description]', description);
      cy.get(`[data-qa=radio-detail-assigned-to]`).type(' ');
      cy.get(`[data-qa=radio-detail-action-by]`).type(' ');
      cy.type_ckeditor('[data-qa=radio-detail-mitigation]', ' ');
    });
  }
);
