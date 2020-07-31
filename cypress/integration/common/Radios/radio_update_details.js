import { When } from 'cypress-cucumber-preprocessor/steps';

When('the user edits the description to {string}', description => {
  cy.get('[data-qa=radio-detail-edit]')
    .click()
    .then(() => {
      cy.type_ckeditor('[data-qa=radio-detail-description]', description);
    });
});

When('cancels the change', () => {
  cy.get('[data-qa=radio-detail-cancel]').click();
});

When('saves the change', () => {
  cy.get('[data-qa=radio-detail-save]').click();
});

When(
  'on expanding the entry, the user can see a change applied on the description with the value set from {string} to {string}',
  (from, to) => {
    cy.get(`[data-qa=radio-chatbox-expand]`).click();
    cy.get('[data-qa=radio-chatbox-table]')
      .contains('td', from)
      .should('exist');
    cy.get('[data-qa=radio-chatbox-table]')
      .contains('td', to)
      .should('exist');
  }
);
