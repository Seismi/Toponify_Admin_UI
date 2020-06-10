import { When } from 'cypress-cucumber-preprocessor/steps';

When('the user enters number {float} into field {string}', function(value, doc_standard) {
  addDocStandard(value, doc_standard);
});

When('the user enters number {int} into field {string}', function(value, doc_standard) {
  addDocStandard(value, doc_standard);
});

When('the user enters string {string} into field {string}', function(value, doc_standard) {
  addDocStandard(value, doc_standard);
});

When('the user enters date {} into field {string}', function(value, doc_standard) {
  addDocStandardDate(value, doc_standard);
});

When('the user enters boolean {} into field {string}', function(value, doc_standard) {
  addDocStandardBoolean(value, doc_standard);
});

function addDocStandard(value, doc_standard) {
  doc_standard = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(doc_standard); // prefix branch to doc standard name
  cy.get(`[data-qa=documentation-standards-table-quick-search]`) // get the quick search
    .clear()
    .type(doc_standard)
    .should('have.value', doc_standard); //enter the documentation standard
  cy.get(`[data-qa=topology-documentation-standards-table]`) //get the doc standard table
    .find('table>tbody') //find the body
    .contains('tr', doc_standard) // and the row which contains
    .find(`[data-qa=documentation-standards-table-edit]`) // get the edit button
    .click()
    .get('[data-qa=documentation-standards-table-value]') // get the value field
    .type(value)
    .then(() => {
      cy.get('[data-qa=documentation-standards-table-save]')
        .click()
        .wait(['@PUTWorkPackagesNodesCustomPropertyValues', '@GETWorkPackageNodeTags']);
    });
}

function addDocStandardBoolean(value, doc_standard) {
  doc_standard = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(doc_standard); // prefix branch to doc standard name
  cy.get(`[data-qa=documentation-standards-table-quick-search]`) // get the quick search
    .clear()
    .type(doc_standard)
    .should('have.value', doc_standard); //enter the documentation standard
  cy.get(`[data-qa=topology-documentation-standards-table]`) // get the documentation standards table
    .find('table>tbody') //find the body
    .contains('tr', doc_standard) // and the row which contains
    .find(`[data-qa=documentation-standards-table-edit]`) // get the edit button
    .click();
  cy.selectDropDown('documentation-standards-table-type', value); // select the value
}

function addDocStandardDate(value, doc_standard) {
  doc_standard = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(doc_standard); // prefix branch to doc standard name
  cy.get(`[data-qa=documentation-standards-table-quick-search]`) // get the quick search
    .clear()
    .type(doc_standard)
    .should('have.value', doc_standard); //enter the documentation standard
  cy.get(`[data-qa=topology-documentation-standards-table]`) // get the documentation standards table
    .find('table>tbody') //find the body
    .contains('tr', doc_standard) // and the row which contains
    .find(`[data-qa=documentation-standards-table-edit]`) // get the edit button
    .click()
    .get('[data-qa=documentation-standards-table-date]') // type the value
    .type(value)
    .should('have.value', value);
}

//
