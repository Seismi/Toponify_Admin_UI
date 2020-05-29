import { When } from 'cypress-cucumber-preprocessor/steps';

When('the user adds the system {string} to scope {string}', function(system, scope) {
  system = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(system); // prefix branch to doc standard name
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // prefix branch to doc standard name
});
