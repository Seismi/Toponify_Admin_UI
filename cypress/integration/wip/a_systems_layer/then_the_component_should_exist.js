const { Then } = require('cypress-cucumber-preprocessor/steps');
const pages = require('../../common/Topology/topology_settings');

Then('the {string} {string} should exist in the table immediately', function(component_type, component) {
  checkTable(component, component_type);
});

Then('the {string} {string} should exist on the canvas immediately', function(component_type, component) {
  assertComponentExistsOnCanvas(component_type, component);
});

Then('the {string} {string} should exist in {string} table in the {string} work package after reload', function(
  component_type,
  component,
  tab,
  work_package
) {
  work_package = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(work_package); // prefix the name with branch
  cy.editWorkPackageTopology(work_package).then(() => {
    cy.get(`[aria-posinset=${pages['tabs'][tab]}]`)
      .click()
      .then(() => {
        checkTable(component, component_type);
      });
  });
});

Then('the {string} {string} should exist on the canvas in the {string} work package after reload', function(
  component,
  work_package
) {
  assertComponentExistsOnCanvas(component, work_package);
});

function checkTable(component, component_type) {
  component = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(component); // add the branch to the name
  let table = component_type === 'system' ? 'components' : 'links';
  cy.get('[data-qa=topology-table-quick-search]')
    .clear()
    .type(component);
  cy.get(`[data-qa=topology-table-${table}]`)
    .find('table>tbody>tr')
    .contains(component)
    .should('exist');
}

function assertComponentExistsOnCanvas(component_type, component) {
  component = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(component); // add the branch to the name
  let result;
  let component_array = component_type === 'system' ? 'nodeDataArray' : 'linkDataArray';
  cy.window().then(window => {
    let dataArray = window.MyRobot.diagram.model[component_array];
    console.log(window.MyRobot);
    result = dataArray.filter(components => {
      return components.name === component;
    });
    console.log(result.length);
    expect(result.length).to.be.greaterThan(0);
  });
}
