import { Then } from 'cypress-cucumber-preprocessor/steps';

Then(
  'the user is redirected to the work package page and the work package {string} is shown in the details',
  workpackage => {
    workpackage = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(workpackage);
    cy.url().should('contain', '/work-packages');
    cy.get('[data-qa=work-packages-details-name]').should('have.value', workpackage);
  }
);
