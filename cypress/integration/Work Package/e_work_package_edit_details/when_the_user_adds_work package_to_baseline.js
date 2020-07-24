const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user adds work package {string} to baseline of work package {string} and clicks to {string}', function(
  baseline,
  workpackage,
  button_action
) {
  baseline = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(baseline); // prefix the name with branch
  cy.get(`[data-qa=work-packages-edit]`)
    .click() // click the work packages edit
    .then(() => {
      cy.get('[data-qa=work-packages-baseline-table-add]') // get the baseline add button
        .click()
        .wait('@GETWorkPackageAvailability')
        .then(() => {
          cy.selectDropDownSearchable('select-modal-search', baseline) // find the baseline
            .then(() => {
              cy.get(`[data-qa=select-modal-${button_action}]`)
                .click()
                .then(() => {
                  if (button_action === 'confirm') cy.wait('@POSTWorkPackageBaseline');
                }); // action the selection
            });
        });
    })
    .then(() => {
      //following spinner does not close
      cy.get('[data-qa=spinner]').should('not.be.visible');
      cy.get('[data-qa=details-spinner]').should('not.be.visible');
    });
});
