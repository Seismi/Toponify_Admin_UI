const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('the scope called {string} does not exist', function(scope) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // prefix the branch to scope
  //If the work package exists then delete it.
  cy.findScope(scope) //find the work packages
    .then($table => {
      if ($table[0].rows.length > 0) {
        //if rows are found
        Object.keys($table[0].rows).forEach(s => {
          //loop through the rows
          cy.deleteScope(scope) //delete the work packages
            .wait('@DELETEScopes');
        });
      }
    });
});
