const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user reloads the page and searches for {string} work package', name => {
  cy.reload()
    .wait(['@GETWorkPackage', '@GETWorkPackagePaging', '@GETUsers', '@GETWorkPackageActive'])
    .then(() => {
      name = Cypress.env('BRANCH')
        .concat(' | ')
        .concat(name);
      cy.get('work-packages-spinner').should('not.be.visible');
      cy.findWorkPackage(name, false).then(() => {
        cy.selectRow('work-packages-table', name);
      });
    });
});
