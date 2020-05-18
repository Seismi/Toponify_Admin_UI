import { Then } from 'cypress-cucumber-preprocessor/steps';
const pages = require('../../../../DEPRECATE_current_pane_set_up').website_structure.pages;

Then('toponify should display the {string} page', function(page) {
  cy.url().should('contain', pages[page]['page_check']); //check that the page is correct for the menu item
});
