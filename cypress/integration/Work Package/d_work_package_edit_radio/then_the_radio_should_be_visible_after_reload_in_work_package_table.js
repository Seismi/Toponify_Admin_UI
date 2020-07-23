import { Then } from 'cypress-cucumber-preprocessor/steps';
const workPackage = require('./../../common/Work Package/work_package_settings');

Then('the radio with title {string} should be visible after reload in the work package radio table', function(title) {
  title = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(title); // prefix the branch to objective
  cy.reload()
    .wait(2000)
    .wait(['@GETWorkPackagePaging', '@GETWorkPackage', '@GETUsers'])
    .then(() => {
      cy.findWorkPackage(title, false).then(() => {
        cy.selectDetailsPaneTab(workPackage['tabs']['Radio']).then(() => {
          cy.assertRowExists('work-packages-radio-table', title); // assert row exists
        });
      });
    });
});
