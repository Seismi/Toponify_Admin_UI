const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user selects relates to tab', () => {
  cy.selectDetailsPaneTab(2);
});
