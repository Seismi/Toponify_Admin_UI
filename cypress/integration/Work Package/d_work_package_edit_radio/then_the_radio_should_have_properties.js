import { Then } from 'cypress-cucumber-preprocessor/steps';
const workPackage = require('./../../common/Work Package/work_package_settings');

Then(
  'the radio with title {string} should have category {string}, status {string}, description {string} be assigned to {string}, should be actioned by {string}, with mitigation resolution {string}, severity {int} and probability {int} against work package {string}',
  function(title, category, status, description, assigned, actioned, mitigation, severity, probability, work_package) {
    work_package = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(work_package); // append the branch to the name
    title = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(title); // append the branch to the name
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
                    cy.assertRadioDetails(
                      title,
                      category,
                      status,
                      assigned,
                      severity,
                      probability,
                      actioned,
                      description,
                      mitigation
                    );
                  });
              });
            });
        });
      });
  }
);
