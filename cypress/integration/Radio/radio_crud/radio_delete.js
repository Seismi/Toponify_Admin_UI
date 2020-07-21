import { When, And } from 'cypress-cucumber-preprocessor/steps';

When('the user updates the filter to show closed radios', () => {
  cy.get('[data-qa=radio-header-filter]').click();
  cy.selectDropDown('radio-filter-status', 'open');
  cy.selectDropDown('radio-filter-status', 'new');
  cy.get(`[data-qa=radio-filter-modal-apply]`)
    .click({ force: true })
    .wait('@POSTradiosAdvancedSearch');
  cy.get('smi-filter-modal').should('not.exist');
});

And('the user clicks on delete', () => {
  cy.get('[data-qa=radio-detail-delete]').click();
});

And('the user cancels the delete', () => {
  cy.get('[data-qa=delete-modal-no]').click();
  cy.get('smi-delete-modal').should('not.exist');
});

And('the user confirms the delete', () => {
  cy.get('[data-qa=delete-modal-yes]').click();
  cy.get('smi-delete-modal').should('not.exist');
});
