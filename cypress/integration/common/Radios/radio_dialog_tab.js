const { When } = require('cypress-cucumber-preprocessor/steps');

When("in the dialogue tab, a new entry appears with today's date, the user's name, the message {string}", message => {
  cy.selectDetailsPaneTab(3);
  cy.get('smi-chatbox')
    .find('p')
    .contains(message);
});
