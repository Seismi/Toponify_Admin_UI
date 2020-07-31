const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the work package called {string} should not exist in the work packages table if archived unchecked', function(
  name
) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); //prefix name with branch

  cy.get('[data-qa=work-packages-archive-toggle]')
    .find('label>div>input')
    .check({ force: true })
    .uncheck({ force: true })
    .then(() => {
      cy.wait('@GETWorkPackagePaging.all');
      cy.get(`[data-qa=work-packages-quick-search]`) //get the work packages quick search
        .clear() // clear the search
        .paste(name)
        .should('have.value', name) // type the name
        .then(() => {
          cy.get(`[data-qa=work-packages-table]`) // get the table
            .find('table>tbody') //find the table body
            .then($table => {
              expect($table[0].rows.length).to.equal(0); // expect the number of rows to equal 0
            });
        });
    });
});

Then('the work package called {string} should not exist in the work packages table if archived checked', function(
  name
) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); //prefix name with branch

  cy.get('[data-qa=work-packages-archive-toggle]')
    .find('label>div>input')
    .uncheck({ force: true })
    .check({ force: true })
    .then(() => {
      cy.wait('@GETWorkPackagePaging.all');

      cy.get(`[data-qa=work-packages-quick-search]`) //get the work packages quick search
        .clear() // clear the search
        .paste(name)
        .should('have.value', name) // type the name
        .then(() => {
          cy.get(`[data-qa=work-packages-table]`) // get the table
            .find('table>tbody') //find the table body
            .then($table => {
              expect($table[0].rows.length).to.equal(0); // expect the number of rows to equal 0
            });
        });
    });
});
