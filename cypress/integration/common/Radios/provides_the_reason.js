import { When } from 'cypress-cucumber-preprocessor/steps';

When('provides the reason {string}', reason => {
  cy.type_ckeditor('[data-qa=radio-discussions-tab-your-message]', reason);
  cy.get('[data-qa=radio-reply-modal-save]')
    .click()
    .wait('@POSTRadioReply');
});
