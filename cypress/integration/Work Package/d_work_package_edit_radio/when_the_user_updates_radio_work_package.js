import { When } from 'cypress-cucumber-preprocessor/steps';
const workPackage = require('./../../common/Work Package/work_package_settings');

When(
  'the user updates the radio with title {string} to have new title {string}, category {string}, status {string}, description {string} which is assigned to {string} and should be action by {string} and mitigation resolution {string} and have severity {int} and probability {int} against work package {string}',
  function(
    title,
    newTitle,
    category,
    status,
    description,
    assigned,
    actioned,
    mitigation,
    severity,
    probability,
    work_package
  ) {
    work_package = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(work_package); // append the branch to the name
    title = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(title); // append the branch to the name
    newTitle = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(newTitle); // append the branch to the name
    cy.reload()
      .wait(['@GETWorkPackages', '@GETWorkPackage', '@GETUsers'])
      .then(() => {
        cy.findWorkPackage(work_package).then(() => {
          cy.selectRow('work-packages-table', work_package) // select the correct row
            .then(() => {
              cy.selectDetailsPaneTab(workPackage['tabs']['Radio']).then(() => {
                cy.findWorkPackageRadio(title)
                  .find('tr') // find the first cell
                  .contains('td', title)
                  .get('[data-qa=work-packages-radio-table-open]')
                  .click()
                  .wait(['@GETNotifications', '@GETUsers', '@GETRadio'])
                  .then(() => {
                    cy.get('[data-qa=radio-detail-edit]')
                      .click()
                      .then(() => {
                        cy.writeRadioDetails(
                          newTitle,
                          category,
                          status,
                          assigned,
                          severity,
                          probability,
                          actioned,
                          description,
                          mitigation
                        );
                        cy.get('[data-qa=radio-detail-save]').click();
                      });
                  });
              });
            });
        });
      });
  }
);
