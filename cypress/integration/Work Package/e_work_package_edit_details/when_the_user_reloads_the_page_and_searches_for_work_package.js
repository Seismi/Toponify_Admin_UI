const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user reloads the page and searches for {string} work package', function(name) {
  cy.reload()
    .wait(['@GETWorkPackage', '@GETWorkPackagePaging', '@GETUsers'])
    .then(() => {
      name = Cypress.env('BRANCH')
        .concat(' | ')
        .concat(name);
      cy.findWorkPackage(name, false).then(() => {
        cy.selectRow('work-packages-table', name); // select the correct row
      });
    });
});
