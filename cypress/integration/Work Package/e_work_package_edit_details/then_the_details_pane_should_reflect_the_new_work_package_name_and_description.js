const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the details pane should reflect the new work package name {string} and description {string}', function(
  name,
  description
) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); // prefix name with branch
  cy.get('[class=rightPane]') // get the right pane
    .within(() => {
      cy.get(`[data-qa=work-packages-details-name]`) // get the work packages name
        .then($input => {
          expect($input[0].value).to.equal(name); // assert the name is correct
        });
      cy.get(`[data-qa=work-packages-details-description]`) // get the work packages description
        .then($input => {
          expect($input[0].value).to.equal(description); // assert description is correct
        });
    });
});
