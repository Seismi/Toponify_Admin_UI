const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the work package {string} does not exist', function(name) {
  //If the work package exists then delete it.
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); // append the branch to the name
  cy.findWorkPackage(name) //find the work packages
    .then($table => {
      if ($table[0].rows.length > 0) {
        //if rows are found
        Object.keys($table[0].rows).forEach(work_package => {
          //loop through the rows
          cy.deleteWorkPackage(name); //delete the work packages
        });
      }
    });
});
