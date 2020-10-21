const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user adds owner {string} to owners of work package {string} and clicks to {string}', function(
  owner,
  workpackage,
  button_action
) {
  cy.get(`[data-qa=work-packages-edit]`)
    .click() // click the edit  button
    .then(() => {
      cy.get('[data-qa=work-packages-owners-table-add]') // add an owner
        .click()
        .wait('@GETTeams')
        .then(() => {
          cy.selectDropDownSearchable('single-select-modal-search', owner); // select the owner
          cy.get(`[data-qa=select-modal-${button_action}]`).click(); // confirm the selection
        });
    });
});
