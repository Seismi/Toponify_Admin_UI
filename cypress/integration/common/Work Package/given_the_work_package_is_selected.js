import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('the {string} is selected', function(name) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); // Append all created components with the branch number sent in as a parameter
  cy.get(`[data-qa=work-packages-quick-search]`) // get the work package quick search, clear and type the work package name
    .clear()
    .type(name)
    .should('have.value', name)
    .then(() => {
      cy.selectRow('work-packages-table', name) // select the correct row in the work packages table
        .wait(['@GETWorkPackage', '@GETWorkPackagePaging']); // Wait for get work package api
    });
});
