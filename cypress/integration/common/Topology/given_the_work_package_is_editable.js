const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the work package {string} is editable', function(work_package) {
  work_package = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(work_package); // prefix the name with branch
  cy.editWorkPackageTopology(work_package);
});
