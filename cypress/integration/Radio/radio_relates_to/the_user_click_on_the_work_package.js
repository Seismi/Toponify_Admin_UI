import { And } from 'cypress-cucumber-preprocessor/steps';

And('the user clicks on the work package {string} in the /radio details', workpackage => {
  workpackage = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(workpackage);
  cy.get('[data-qa=radio-relates-to-table-quick-search]').type(workpackage);
  cy.get('[data-qa=radio-relates-to-table-work-package]')
    .click()
    .wait(['@GETMyProfile', '@GETUsers', '@GETWorkPackagePaging', '@GETWorkPackage', '@GETWorkPackage']);
});
