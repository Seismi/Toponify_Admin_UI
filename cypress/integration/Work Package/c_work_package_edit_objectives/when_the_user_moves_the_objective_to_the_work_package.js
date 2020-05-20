import { When } from 'cypress-cucumber-preprocessor/steps';

When('the user moves the {string} objective to the work package {string}', (objective, work_package) => {
  work_package = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(work_package); // prefix work package with branch
  cy.get(`[data-qa=work-packages-objectives-table]`) // get the objectives table
    .find('table>tbody') // get the table body
    .contains('td', objective) // get the objective
    .get(`[data-qa=work-packages-objectives-table-move]`) // find the move button
    .click()
    .then(() => {
      cy.get(`[data-qa=work-packages-move-objectives-modal-select]`) // get the modal select
        .click()
        .get('mat-option') //find the mat-option
        .contains(work_package) // that contains work package
        .click({ force: true }); //select
    });
});