import { Then } from 'cypress-cucumber-preprocessor/steps';
const settings = require('./scope_and_layouts_settings');

Then('toponify should display the Scopes and Layouts page', function(page) {
  cy.url().should('contain', settings['page_check']); //check that the page is correct for the menu item
});