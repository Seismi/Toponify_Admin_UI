import { And } from 'cypress-cucumber-preprocessor/steps';

And('the user assign radio {string} to component with work package selected {string}', (radio, work_package) => {
  radio = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(radio); // append the branch name to the test work package to differentiate between branch test

  cy.get('[data-qa=related-radio-table-assign-radio]')
    .click()
    .wait('@GETRadios');
  cy.get('[data-qa=work-packages-radio-list-quick-search]')
    .clear()
    .paste(radio);
  cy.get('[data-qa=work-packages-radio-modal-list]')
    .find('table>tbody')
    .find('tr :first')
    .click()
    .then(() => {
      cy.get('[data-qa=work-packages-radio-modal-save]')
        .click()
        .then(() => {
          cy.selectDropDown('topology-radio-confirm-modal-name', work_package);
          cy.get('[data-qa=topology-radio-confirm-modal-save]')
            .click()
            .wait(['@POSTWorkPackageNodeRadios', '@GETNodesQuery', '@GETNodeLinksQuery', '@GETWorkPackageNodeTags']);
          cy.get('[data-qa=spinner]').should('not.be.visible');
          cy.get('[data-qa=details-spinner]').should('not.be.visible');
          cy.wait(10000);
          cy.get('[data-qa=related-radio-table-quick-search]')
            .clear()
            .paste(radio);
          cy.get('[data-qa=topology-related-radio-table]')
            .find('table>tbody')
            .contains(radio);
        });
    });
});

And('the user assign radio {string} to component with work package selected {string} and cancel', radio => {
  radio = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(radio); // append the branch name to the test work package to differentiate between branch test

  cy.get('[data-qa=related-radio-table-assign-radio]').click();
  cy.get('[data-qa=work-packages-radio-list-quick-search]')
    .clear()
    .paste(radio);
  cy.get('[data-qa=work-packages-radio-modal-list]')
    .find('table>tbody')
    .find('tr :first')
    .click()
    .then(() => {
      cy.get('[data-qa=work-packages-radio-modal-cancel]').click();
    });
});
