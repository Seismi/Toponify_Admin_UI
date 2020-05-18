import { Given } from 'cypress-cucumber-preprocessor/steps';

Given(
  'the user adds an objective to the work package {string} and gives it the name {string} with description {string}',
  function(work_package, name, description) {
    name = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(name); // prefix name with branch
    description = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(description); // prefix description with branch
    cy.get('[data-qa=work-packages-objectives-table-add]') // add the objective
      .click()
      .then(() => {
        cy.get('[data-qa=work-packages-objectives-modal-name]').type(name); // enter the name
        cy.get('[data-qa=work-packages-objectives-modal-description]').type(description); // enter the description
      });
  }
);
