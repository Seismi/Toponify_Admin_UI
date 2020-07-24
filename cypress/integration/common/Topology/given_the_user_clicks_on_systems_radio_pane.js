import { Given } from 'cypress-cucumber-preprocessor/steps';

Given("the user clicks on the system's right hand side radio button", function(button) {
  cy.get(`[data-qa=right-hand-side-radio]`)
    .click()
    .wait('@GETWorkPackageNodeTags');
  cy.get('[data-qa=spinner]').should('not.be.visible');
});
