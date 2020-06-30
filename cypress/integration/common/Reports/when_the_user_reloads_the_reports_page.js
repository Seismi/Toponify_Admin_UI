const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user reloads the Reports page', function(usertype) {
  let wait = [
    '@GETMyProfile',
    '@GETScopes.all',
    '@GETScope.all',
    '@GETWorkPackages.all',
    '@GETSelectorAvailabilityQuery.all',
    '@GETReportsFilterQuery',
    '@GETLayout.all'
  ];
  cy.reload();
  cy.get('[data-qa=spinner]').should('not.be.visible');
  cy.wait(wait);
  cy.get('[data-qa=spinner]').should('not.be.visible');
});
