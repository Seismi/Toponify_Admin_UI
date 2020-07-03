import { When } from 'cypress-cucumber-preprocessor/steps';

When('the user adds the system {string} to the scope {string}', function(system, scope) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // add the branch to the name

  cy.get('[data-qa=topology-scopes-table-add-to-existing]').click();
  cy.get('[data-qa=details-spinner]').should('not.be.visible');
  cy.selectDropDownNoClick('add-scope-modal-name', scope);
  cy.get('[data-qa=add-scope-modal-save]')
    .click()
    .wait(['@POSTScopesNodes', '@GETNodesScopes']);
});
