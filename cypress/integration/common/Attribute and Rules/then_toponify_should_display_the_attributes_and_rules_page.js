import { Then } from 'cypress-cucumber-preprocessor/steps';
const settings = require('./attribute_and_rules_settings');

Then('toponify should display the Attributes and Rules page', function(page) {
  cy.url().should('contain', settings['page_check']); //check that the page is correct for the menu item
});
