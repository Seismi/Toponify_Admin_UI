import { When, And } from 'cypress-cucumber-preprocessor/steps';

When('the user closes the radio {string}', title => {
  cy.get('[data-qa=radio-detail-archive]').click();
});

And('the delete button should be visible', () => {
  cy.get('[data-qa=radio-detail-delete]').should('be.visible');
});

When(
  'on expanding the entry, the user can see a change applied on the status with the value set from {string} to {string}',
  (from, to) => {
    cy.get(`[data-qa=radio-chatbox-expand]`).click({ multiple: true });
    cy.get('smi-chatbox')
      .find(`[data-qa=radio-chatbox-set]`)
      .contains(from)
      .should('exist');
    cy.get('smi-chatbox')
      .find(`[data-qa=radio-chatbox-to]`)
      .contains(to)
      .should('exist');
  }
);
