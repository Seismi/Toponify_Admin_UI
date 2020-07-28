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
      .clear({ force: true })
      .type(reference)
      .should('have.value', reference);
    cy.get('[data-qa=object-details-name]')
      .clear({ force: true })
      .type(name)
      .should('have.value', name);
    cy.get('[data-qa=object-details-description]')
      .clear({ force: true })
      .type(description)
      .should('have.value', description);
    cy.selectDropDown('object-details-category', category).then(() => {
      cy.get('[data-qa=object-details-save]')
        .click()
        .wait(wait_for);
    });
  }
);
