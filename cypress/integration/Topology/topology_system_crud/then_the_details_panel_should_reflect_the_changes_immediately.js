const { Then } = require('cypress-cucumber-preprocessor/steps');
Then(
  'the details panel should reflect the reference number: {string}, name: {string}, category: {string}, description: {string}, owners {string} immediately',
  function(reference, name, category, description, owners) {
    name = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(name); // prefix the name with branch
    cy.assertDetailsForm(reference, name, description, category);
  }
);
