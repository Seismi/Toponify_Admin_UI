import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('the user is redirected to the topology page with selected component {string}', component => {
  component = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(component);
  cy.url().should('contain', '/topology');
});
