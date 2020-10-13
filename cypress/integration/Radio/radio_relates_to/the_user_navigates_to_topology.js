import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('the user selects relates to with work package name {string} and navigates to topology page', workpackage => {
  workpackage = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(workpackage);

  let wait = [
    '@GETScopes',
    '@GETLayouts',
    '@GETWorkPackages',
    '@GETTeams',
    '@GETSelectorAvailabilityQuery',
    '@POSTradiosAdvancedSearch',
    '@GETScope',
    '@GETLayout',
    '@GETNodesQuery',
    '@GETNodeLinksQuery',
    '@GETSelectorAvailabilityQuery'
  ];

  cy.get('[data-qa=radio-relates-to-table-quick-search]').type(workpackage);
  cy.get('[data-qa=radio-relates-to-launch]')
    .click()
    .wait(wait);
  cy.get('[data-qa=topology-spinner]').should('not.be.visible');
  cy.get(['data-qa=spinner']).should('not.be.visible');
});
