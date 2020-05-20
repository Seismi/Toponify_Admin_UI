const { When, Then } = require('cypress-cucumber-preprocessor/steps');
const pages = require('../../common/Topology/topology_settings');

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

Then(
  'the details panel should reflect the reference number: {string}, name: {string}, category: {string}, description: {string}, owners {string} immediately',
  function(reference, name, category, description, owners) {
    name = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(name); // prefix the name with branch
    assertDetailsForm(reference, name, description, category);
  }
);

Then(
  'the details panel should reflect the reference number: {string}, name: {string}, category: {string}, description: {string}, owners {string} against work package {string} after reload',
  function(reference, system, category, description, owners, work_package) {
    work_package = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(work_package); // prefix the name with branch
    system = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(system); // prefix the name with branch
    cy.editWorkPackageTopology(work_package).then(() => {
      cy.get(`[aria-posinset=${pages['Topology']['tabs']['Systems']}]`) // use the current pane set up file to identify the posinset for angular materials tab as data-qa cannot be used
        .click()
        .then(() => {
          cy.selectTableFirstRow(system, 'topology-table-quick-search', 'topology-table-components')
            .click()
            .wait(['@GETNodesScopes', '@GETNodesWorkPackageQuery2', '@GETNodesReportWorkPackageQuery'])
            .then(() => {
              cy.get(`[data-qa=right-hand-side-details]`)
                .click()
                .wait('@GETWorkPackageNodeTags');
              assertDetailsForm(reference, system, description, category);
            });
        });
    });
  }
);

function assertDetailsForm(reference, name, description, category) {
  if (reference.length > 0) cy.get('[data-qa=object-details-reference]').should('have.value', reference);
  cy.get('[data-qa=object-details-name]').should('have.value', name);
  if (reference.description > 0) cy.get('[data-qa=object-details-description]').should('have.value', description);
  if (reference.category > 0)
    cy.get('[data-qa=object-details-category]')
      .find('.mat-select-value>span>span')
      .should('have.text', category);
}
