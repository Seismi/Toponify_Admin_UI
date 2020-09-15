import { When } from 'cypress-cucumber-preprocessor/steps';

When('the user adds the system {string} to the scope {string}', function(system, scope) {
  scope = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(scope); // add the branch to the name
  cy.get('[data-qa=right-hand-pane-close]')
    .click({ force: true })
    .then(() => {
      cy.get('[data-qa=right-hand-side-scopes]')
        .click()
        .wait(['@GETWorkPackageNodeTags', '@GETNodesScopes'])
        .get('[data-qa=details-spinner]')
        .should('not.be.visible');
    });

  cy.get('[data-qa=details-spinner]').should('not.be.visible');

  cy.get('[data-qa=topology-scopes-table-add-to-existing]').click();

  cy.get('[data-qa=details-spinner]').should('not.be.visible');

  cy.selectDropDownNoClick('add-scope-modal-name', scope);

  cy.get('[data-qa=add-scope-modal-save]')
    .click()
    .wait('@POSTScopesNodes', { requestTimeout: 10000 })
    .wait('@GETNodesScopes', { requestTimeout: 10000 })
    .get('[data-qa=details-spinner]')
    .should('not.be.visible');
});
