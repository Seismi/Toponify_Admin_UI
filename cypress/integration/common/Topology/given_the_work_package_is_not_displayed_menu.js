const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the work package {string} is {string} on the {string} menu', function(work_package, action, work_package_menu) {
  let wait_for = [];
  work_package = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(work_package); // prefix the name with branch

  if (work_package_menu === 'reports') {
    work_package_menu = 'reports-work-package-table';
    wait_for = ['@GETReportsFilterQuery.all'];
  } else {
    work_package_menu = 'left-hand-pane-work-package-table';
    wait_for = ['@GETNodesWorkPackageQuery', '@GETNodeLinksWorkPackageQuery', '@GETSelectorAvailabilityQuery'];
  }
  cy.displayWorkPackage(work_package, work_package_menu, wait_for, action === 'not displayed' ? 'uncheck' : 'check');
  //cy.get('[data-qa=object-details-delete]').should('not.be.visible');
  cy.get('[data-qa=spinner]').should('not.be.visible');
});
