const { When } = require('cypress-cucumber-preprocessor/steps');

When(
  'the user changes the reference number: {string}, name: {string}, category: {string}, description: {string}, owners {string}',
  function(reference, name, category, description, owners) {
    name = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(name); // prefix the name with branch
    cy.get('[data-qa=object-details-reference]')
      .clear()
      .type(reference);
    cy.get('[data-qa=object-details-name]')
      .clear()
      .type(name);
    cy.get('[data-qa=object-details-description]')
      .clear()
      .type(description);
    cy.selectDropDown('object-details-category', category).then(() => {
      cy.get('[data-qa=object-details-save]')
        .click()
        .wait(['@PUTWorkPackagesNodes', '@GETNodesScopes']);
    });
  }
);
