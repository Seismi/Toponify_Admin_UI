const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the work package {string} is editable on the {string} menu', function(work_package, work_package_menu) {
  let wait_for;
  work_package = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(work_package); // prefix the name with branch
  console.log(work_package_menu);
  if (work_package_menu === 'reports') {
    work_package_menu = 'reports-work-package-table';
    wait_for = '';
  } else {
    work_package_menu = 'left-hand-pane-work-package-table';
    wait_for = ['@GETNodesWorkPackageQuery', '@GETNodeLinksWorkPackageQuery', '@GETSelectorAvailabilityQuery'];
  }
  cy.editWorkPackage(work_package, work_package_menu, wait_for);
});
