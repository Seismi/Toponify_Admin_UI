import { When } from 'cypress-cucumber-preprocessor/steps';

When('enters a comment {string}', function(comment) {
  cy.type_ckeditor('[data-qa=radio-discussions-tab-your-message]', comment);
  cy.get('[data-qa=radio-reply-modal-save]')
    .click()
    .wait('@POSTradiosAdvancedSearch')
    .wait('@POSTRadioReply', '@GETRadioTags');
});
