const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user selects the work package {string}', function(work_package) {
  work_package = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(work_package); // append the branch to the name
  cy.get(`[data-qa=work-packages-quick-search]`) // get the work package search
    .clear()
    .type(work_package) // enter the work package
    .then(() => {
      cy.selectRow('work-packages-table', work_package).wait('@GETWorkPackage'); //select the work package
    });
});
