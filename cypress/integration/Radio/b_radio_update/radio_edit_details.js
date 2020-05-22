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

When('cancels when asked to provide the reason for the change', () => {
  cy.get('[data-qa=radio-reply-modal-cancel]').click();
});
