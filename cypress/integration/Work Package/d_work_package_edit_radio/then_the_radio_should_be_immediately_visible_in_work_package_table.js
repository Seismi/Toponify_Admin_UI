import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('the radio with title {string} should be immediately visible in the work package radio table', function(title) {
  title = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(title); // prefix the branch to objective
  cy.assertRowExists('work-packages-radio-table', title); // assert row exists
});
