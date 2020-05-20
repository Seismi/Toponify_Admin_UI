import { Then } from 'cypress-cucumber-preprocessor/steps';
const settings = require('./logout_settings');

Then('toponify should display the Logout page', function(page) {
  cy.url().should('contain', settings['page_check']); //check that the page is correct for the menu item
});