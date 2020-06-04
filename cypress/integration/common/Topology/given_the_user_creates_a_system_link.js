import { Given, When } from 'cypress-cucumber-preprocessor/steps';

When('the user creates a new {string} interface with name {string} between {string} and {string}', function(
  interface_type,
  name,
  source,
  target
) {
  name = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(name); // add the branch to the name
  source = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(source); // add the branch to the name
  target = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(target); // add the branch to the name
  console.log(name);
  cy.get('[data-qa=topology-table-create-new]')
    .click()
    .then(() => {
      cy.selectDropDownNoClick('topology-components-or-link-modal-category', interface_type).then(() => {
        cy.selectDropDownNoClick('topology-components-or-link-modal-source', source).then(() => {
          cy.selectDropDownNoClick('topology-components-or-link-modal-target', target);
          cy.get('[data-qa=topology-components-or-link-modal-name]')
            .clear()
            .type(name)
            .then(() => {
              cy.get('[data-qa=topology-components-or-link-modal-save]').click();
            });
        });
      });
    });
});
