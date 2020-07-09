const { When } = require('cypress-cucumber-preprocessor/steps');

When(
  'the user has created and selected a work package called {string}, with a description {string}, baseline {string} and owner {string}',
  function(name, description, baseline, owner) {
    name = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(name); // append the branch name to the test work package to differentiate between branch test
    cy.findWorkPackage(name, false, true).then($table => {
      if ($table[0].rows.length === 0) {
        // check if the search returned a result
        cy.wait(2000);
        cy.createWorkPackage(name, description, baseline, owner); // create work package as it has not yet been created
      } else {
        Object.keys($table[0].rows).forEach(work_package => {
          //loop through the rows
          cy.deleteWorkPackage(name); //delete the work packages
        });
        cy.createWorkPackage(name, description, baseline, owner); // create work package as it has not yet been created
      }
    });
  }
);
