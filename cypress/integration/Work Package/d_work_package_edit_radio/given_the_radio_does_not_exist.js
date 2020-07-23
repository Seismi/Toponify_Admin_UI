const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the radio {string} does not exist against work package {string}', function(radio, work_package) {
  //If the work package exists then delete it.
  radio = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(radio); // append the branch to the name
  work_package = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(work_package); // append the branch to the name

  cy.findWorkPackage(work_package, false) //find the work packages
    .then($table => {
      if ($table[0].rows.length > 0) {
        //if rows are found
        Object.keys($table[0].rows).forEach(wp => {
          //loop through the rows
          cy.deleteWorkPackage(work_package); //delete the work packages
        });
      }
    });
});
