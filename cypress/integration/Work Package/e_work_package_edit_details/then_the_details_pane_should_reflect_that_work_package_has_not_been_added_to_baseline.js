const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the details pane should reflect that {string} has not been added to baseline of work package {string}', function(
  baseline,
  name
) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); // prefix name with branch
  baseline = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(baseline); // prefix baseline with branch

  cy.get(`[data-qa=work-packages-quick-search]`) // get the search bar
    .clear() //clear value
    .type(name) //type name
    .then(() => {
      cy.get(`[data-qa=work-packages-table]`)
        .find('table>tbody')
        .then($table => {
          cy.selectRow('work-packages-table', name) // select work package
            .then(() => {
              cy.get('[data-qa=work-packages-baseline-table]')
                .contains(baseline)
                .should('not.exist'); // check if baseline exists
            });
        });
    });
});
