import { Given } from 'cypress-cucumber-preprocessor/steps';

Given("the user clicks on the system's right hand side scope button", function(button) {
  cy.get(`[data-qa=right-hand-side-scope]`).click();
});
