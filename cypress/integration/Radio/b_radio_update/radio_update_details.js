import { When } from 'cypress-cucumber-preprocessor/steps';

When(
  'the radio {string} exists with title {string}, category {string}, status {string}, description {string} which is assigned to {string} and should be actioned by {string} and mitigation resolution {string} and have severity {int} and probability {int}',
  (title, radio) => {
    title = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(title);
    cy.findRadio(name).wait('@GETRadios');
    cy.selectRow('radio-table', radio).wait('@GETRadio');
  }
);

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
  cy.get('smi-reply-modal').should('not.exist');
});

When('provides the reason {string}', reason => {
  cy.type_ckeditor('[data-qa=radio-discussions-tab-your-message]', reason);
  cy.get('[data-qa=radio-reply-modal-save]')
    .click()
    .wait('@POSTRadioReply');
});

When("in the dialogue tab, a new entry appears with today's date, the user's name, the message {string}", message => {
  cy.selectDetailsPaneTab(3);
});

When(
  'on expanding the entry, the user can see a change applied on the description with the value set from {string} to {string}',
  message => {
    cy.get(`[data-qa=radio-chatbox-expand]`).click();
  }
);
