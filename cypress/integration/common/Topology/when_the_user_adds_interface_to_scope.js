import { When } from 'cypress-cucumber-preprocessor/steps';

When('the user adds the interface {string} to the scope {string}', function(link, scope) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // add the branch to the name

  cy.get('[data-qa=topology-scopes-table-add-to-existing]').click();
  cy.selectDropDownNoClick('add-scope-modal-name', scope);
  cy.get('[data-qa=add-scope-modal-save]')
    .click()
    .wait('@POSTScopesNodes')
    .wait('@GETNodesScopes');
});
