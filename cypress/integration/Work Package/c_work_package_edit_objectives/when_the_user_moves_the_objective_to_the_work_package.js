import { When } from 'cypress-cucumber-preprocessor/steps';

When('the user moves the {string} objective to the work package {string}', (objective, work_package) => {
  work_package = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(work_package); // prefix work package with branch

  objective = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(objective); // prefix work package with branch

  cy.get(`[data-qa=work-packages-objectives-table]`) // get the objectives table
    .find('table>tbody') // get the table body
    .contains('td', objective) // get the objective
    .get(`[data-qa=work-packages-objectives-table-move]`) // find the move button
    .click()
    .then(() => {
      cy.wait(5000);
      cy.selectDropDownNoClick('work-packages-move-objectives-modal-select', work_package);
    });
});
