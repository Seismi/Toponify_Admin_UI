import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('I am on the login page', function() {
  cy.visit('/#/auth/login?returnUrl=%2Fhome'); //base url stored in cypress.json
});
