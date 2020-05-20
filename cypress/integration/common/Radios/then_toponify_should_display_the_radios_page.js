import { Then } from 'cypress-cucumber-preprocessor/steps';
const settings = require('./radios_settings');

Then('toponify should display the Radios page', page => {
  cy.url().should('contain', settings['page_check']); //check that the page is correct for the menu item
});
