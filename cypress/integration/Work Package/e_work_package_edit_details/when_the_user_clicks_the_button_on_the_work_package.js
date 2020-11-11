const { When } = require('cypress-cucumber-preprocessor/steps');

When('the user clicks the {string} button on the work package', action_button => {
  cy.get(`[data-qa=work-packages-${action_button}]`).click();
  if (action_button === 'submit') {
    cy.wait('@POSTsubmitWorkPackage');
  } else if (action_button === 'reset') {
    cy.wait('@POSTresetWorkPackage');
  } else if (action_button === 'approve') {
    cy.wait('@POSTapproveWorkPackage');
  } else if (action_button === 'supersede') {
    cy.wait('@POSTsupersedeWorkPackage');
  } else {
    cy.wait('@PUTWorkPackage');
  }
  cy.get('work-packages-spinner').should('not.be.visible');
});
