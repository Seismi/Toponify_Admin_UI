const { When } = require('cypress-cucumber-preprocessor/steps');

When(
  'the user has created and selected a work package called {string}, with a description {string}, baseline {string} and owner {string}',
  function(name, description, baseline, owner) {
    name = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(name); // append the branch name to the test work package to differentiate between branch test
    cy.findWorkPackage(name, false, true).then($table => {
      if ($table[0].rows.length === 0) {
        // check if the search returned a result
        cy.wait(2000);
        createWorkPackage(name, description, baseline, owner); // create work package as it has not yet been created
      } else {
        Object.keys($table[0].rows).forEach(work_package => {
          //loop through the rows
          cy.deleteWorkPackage(name); //delete the work packages
        });
        createWorkPackage(name, description, baseline, owner); // create work package as it has not yet been created
      }
    });
  }
);

function createWorkPackage(name, description, baseline, owner) {
  cy.get(`[data-qa=work-packages-create-new]`)
    .click()
    //.get('[data-qa=spinner]')
    //.should('not.be.visible')
    .wait(['@GETTeams', '@GETWorkPackages', '@GETWorkPackagePaging'])
    .then(() => {
      if (baseline.length > 0) {
        cy.selectDropDown('work-packages-details-baseline-selection', baseline);
      }
      if (owner.length > 0) {
        cy.selectDropDown('work-packages-details-owners-selection', owner);
      }
      cy.get('smi-workpackage-modal').within(() => {
        cy.get(`[data-qa=work-packages-details-name]`)
          .type(name)
          .should('have.value', name)
          .get(`[data-qa=work-packages-details-description]`)
          .type(description)
          .should('have.value', description)
          .get(`[data-qa=work-packages-modal-save]`)
          .click()
          .wait(['@POSTWorkPackage', '@GETWorkPackage'], { requestTimeout: 20000, responseTimeout: 40000 });
      });
    });
}
