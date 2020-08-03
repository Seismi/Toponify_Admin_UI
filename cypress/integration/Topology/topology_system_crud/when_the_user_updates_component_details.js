const { When } = require('cypress-cucumber-preprocessor/steps');

When(
  'the user changes the {string} reference number: {string}, name: {string}, category: {string}, description: {string}, owners {string}',
  function(type, reference, name, category, description, owners) {
    let wait_for;
    name = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(name); // prefix the name with branch
    if (type === 'system') {
      wait_for = '@PUTWorkPackagesNodes';
    } else {
      wait_for = ['@GETnodeLinksWorkPackageQuery', '@GETWorkPackageNodeLinksQuery'];
    }
    cy.get('[data-qa=object-details-reference]')
      .clear()
      .paste(reference)
      .should('have.value', reference);
    cy.get('[data-qa=object-details-name]')
      .clear()
      .paste(name)
      .should('have.value', name);
    cy.get('[data-qa=object-details-description]')
      .clear()
      .paste(description)
      .should('have.value', description);
    cy.selectDropDown('object-details-category', category).then(() => {
      cy.get('[data-qa=object-details-save]')
        .click()
        .wait(wait_for);
    });
  }
);
