const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the details pane should reflect that {string} has been added as an owner of work package {string}', function(
  owner,
  name
) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); // prefix name with branch
  cy.get(`[data-qa=work-packages-quick-search]`) // get the work packages quick search
    .clear() // clear it
    .type(name) // type the name
    .then(() => {
      cy.get(`[data-qa=work-packages-table]`) // get the table
        .find('table>tbody') // get the table body
        .then($table => {
          cy.selectRow('work-packages-table', name) //select the correct row on the work packages table
            .then(() => {
              cy.get('[data-qa=work-packages-owners-table]').contains(owner); // check that the table contains owner
            });
        });
    });
});
