const { When } = require('cypress-cucumber-preprocessor/steps');

When(
  'the user creates a work package called {string}, with a description {string}, baseline {string} and owner {string}',
  function(name, description, baseline, owner) {
    name = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(name); // add the branch to the name
    /*    if (baseline.length > 0) cy.selectDropDown('work-packages-details-baseline-selection', baseline); //if a baseline is specified then select
    if (owner.length > 0) cy.selectDropDown('work-packages-details-owners-selection', owner); // if an owner is specified then select
    cy.get('smi-workpackage-modal') // get the form
      .within(() => {
        //within it
        cy.get(`[data-qa=work-packages-details-name]`) //get the name input
          .type(name)
          .should('have.value', name); //enter the name
        cy.get(`[data-qa=work-packages-details-description]`) // get the description input
          .type(description)
          .should('have.value', description); // enter the description
      });*/
    cy.populateWorkPackageDetails(name, description, baseline, owner);
  }
);
