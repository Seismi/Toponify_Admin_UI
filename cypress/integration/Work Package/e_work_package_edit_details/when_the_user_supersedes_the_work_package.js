const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user supersedes the work package', function() {
  cy.get(`[data-qa=work-packages-supersede]`).click(); //get the work package and supersede
});
