const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the details pane should reflect that {string} has been added to baseline of work package {string}', function(
  baseline,
  name
) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); // prefix the name with branch
  baseline = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(baseline); // prefix baseline with branch
  cy.get(`[data-qa=work-packages-quick-search]`) // find work packages quick search
    .clear({ force: true }) // clear
    .type(name)
    .should('have.value', name) // type the name
    .then(() => {
      cy.get(`[data-qa=work-packages-table]`) // get the work packages table
        .find('table>tbody') // get the table body
        .then($table => {
          cy.selectRow('work-packages-table', name) // select the row
            .then(() => {
              cy.get('[data-qa=work-packages-baseline-table]').contains(baseline); // check the work package has been added to table
            });
        });
    });
});
