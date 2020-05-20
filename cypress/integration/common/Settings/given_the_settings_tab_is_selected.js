const { Given } = require('cypress-cucumber-preprocessor/steps');
const pages = require('../Settings/settings_settings');

Given('the {string} {string} tab is selected', function(screen, tab) {
  let wait_for;
  switch (tab) {
    case 'My User':
      openTab(screen, tab, ['@GETmyProfile', '@GETRoles']);
      break;
    case 'Teams':
      openTab(screen, tab, '@GETTeams');
      break;
    case 'All Users':
      openTab(screen, tab, '@GETUsers');
      break;
  }
});

function openTab(screen, tab, wait_for) {
  //open tab and wait for the correct API's to respond
  cy.get(`[aria-posinset=${pages['tabs'][tab]}]`) //get the posinset for the all users tab
    .click() // open
    .then(() => {
      cy.wait(wait_for); //wait for the relevant routes
    });
}
