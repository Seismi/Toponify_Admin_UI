const { And } = require('cypress-cucumber-preprocessor/steps');

When('the user cancels the creation of the radio', () => {
  cy.get(`[data-qa=radio-modal-cancel]`)
    .click({ force: true })
    .reload()
    .wait(['@GETRadios', '@POSTradiosAdvancedSearch', '@GETNodes', '@GETRadioViews']);
});

When('confirms the creation of the radio', () => {
  cy.get(`[data-qa=radio-modal-save]`)
    .click()
    .then(() => {
      cy.wait(['@POSTRadios', '@POSTradiosAdvancedSearch', '@GETRadio']);
      cy.reload();
    });
});

And('the user clicks on create new radio at the button of the radio table', () => {
  cy.get(`[data-qa=radio-create-new]`).click();
});

And(
  'the user creates a radio with title {string}, category {string}, status {string}, description {string} which is assigned to {string} and should be actioned by {string} and mitigation resolution {string} and have severity {int} and probability {int}',
  (title, category, status, description, assigned, actioned, mitigation) => {
    title = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(title);
    cy.writeRadioDetails(title, category, status, assigned, 1, 2, actioned, description, mitigation);
  }
);
