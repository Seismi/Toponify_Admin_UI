import { Then } from 'cypress-cucumber-preprocessor/steps';
const settings = require('./documentation_standards_settings');

Then('toponify should display the Documentation Standard page', function(page) {
  cy.url().should('contain', settings['page_check']); //check that the page is correct for the menu item
});
