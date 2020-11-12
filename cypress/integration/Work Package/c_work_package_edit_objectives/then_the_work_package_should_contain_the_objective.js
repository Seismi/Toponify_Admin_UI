const { Then } = require('cypress-cucumber-preprocessor/steps');

Then('the work package objective tables should contain the objective called {string}', objective => {
  objective = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(objective);
  cy.get('[data-qa=work-packages-objectives-table]')
    .find('table>tbody')
    .contains('td', objective);
});
