import { When } from 'cypress-cucumber-preprocessor/steps';

When(
  'the user creates the documentation standard {string} with description {string}, type {string} against {string} component',
  function(doc_standard, description, type, component) {
    doc_standard = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(doc_standard); //add the branch to the work package name
    cy.createDocumentationStandard(doc_standard, type, component); // create the documentation standard
  }
);
