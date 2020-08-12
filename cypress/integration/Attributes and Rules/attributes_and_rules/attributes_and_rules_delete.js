import { And } from 'cypress-cucumber-preprocessor/steps';

And('the user deletes the attribute and cancel', () => {
  cy.get('[data-qa=attributes-and-rules-delete]')
    .click()
    .then(() => {
      cy.get('[data-qa=delete-modal-no]').click();
    });
});

And('the user deletes the attribute and confirm', () => {
  cy.get('[data-qa=attributes-and-rules-delete]')
    .click()
    .then(() => {
      cy.get('[data-qa=delete-modal-yes]')
        .click()
        .wait('@POSTDeleteAttribute');
    });
});
