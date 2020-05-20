const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user removes work package {string} from baseline of work package {string} and clicks to {string}', function(
  baseline,
  workpackage,
  button_action
) {
  baseline = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(baseline); // prefix the baseline work package with the branch
  cy.get(`[data-qa=work-packages-edit]`)
    .click() // edit the work package
    .then(() => {
      cy.get(`[data-qa=work-packages-baseline-table]`)
        .find('table>tbody')
        .contains('tr', baseline)
        .find('.cdk-column-delete > .mat-icon')
        .click() // get the baseline delete button
        .then(() => {
          cy.get('[data-qa=delete-modal-yes]')
            .click() // confirm the delete
            .wait('@DELETEWorkPackageBaseline');
        });
    });
});
