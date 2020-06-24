import { And } from 'cypress-cucumber-preprocessor/steps';

And('the user assign radio {string} to component with work package selected {string}', (radio, work_package) => {
  cy.get('[data-qa=related-radio-table-assign-radio]').click();
  cy.get('[data-qa=work-packages-radio-list-quick-search]')
    .clear()
    .type(radio);
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
            .wait(['@POSTWorkPackageNodeRadios', '@GETNodesWorkPackageQuery.all', '@GETNodeLinksWorkPackageQuery.all'])
            .then(() => {
              cy.get('[data-qa=related-radio-table-quick-search]')
                .clear()
                .type(radio);
              cy.get('[data-qa=topology-related-radio-table]')
                .find('table>tbody')
                .contains(radio);
            });
        });
    });
});
