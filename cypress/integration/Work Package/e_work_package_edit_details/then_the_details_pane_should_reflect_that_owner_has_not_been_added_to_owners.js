const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the details pane should reflect that {string} has not been added as an owner of work package {string}', function(
  owner,
  name
) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); // prefix name with branch
  cy.get(`[data-qa=work-packages-quick-search]`) // get the work packages quick search
    .clear({ force: true }) // clear
    .type(name)
    .should('have.value', name) // type the name
    .then(() => {
      cy.get(`[data-qa=work-packages-table]`) // get the table
        .find('table>tbody') // find the table body
        .then($table => {
          cy.selectRow('work-packages-table', name) // select the row
            .then(() => {
              cy.get('[data-qa=work-packages-owners-table]')
                .contains(owner)
                .should('not.exist'); // check that the owner is not in the owners table
            });
        });
    });
});
