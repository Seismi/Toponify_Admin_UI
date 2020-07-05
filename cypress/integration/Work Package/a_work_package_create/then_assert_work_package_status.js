const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the work package {string} should not be created', function(work_package) {
  assertWorkPackage(work_package, 'not.exist');
});

Then('the work package {string} should be created', function(work_package) {
  assertWorkPackage(work_package, 'exist');
});

function assertWorkPackage(work_package, criteria) {
  work_package = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(work_package); // prefix the name with the branch
  cy.reload().wait('@GETWorkPackages'); //wait for the relevant apis to return
  cy.findWorkPackage(work_package, false)
    .contains('td', work_package) // find the cell that contains the user
    .should(criteria); // assert that it exists
}
