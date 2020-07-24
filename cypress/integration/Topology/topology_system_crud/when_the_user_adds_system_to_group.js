const { when } = require('cypress-cucumber-preprocessor/steps');

when('the user adds system {string} to group {string}', function(system, group) {
  cy.get('[data-qa=grouped-in-table-add-to-group]')
    .click()
    .then(() => {
      cy.selectDropDownNoClick('select-modal-search', group).then(() => {
        cy.get('[data-qa=select-modal-confirm')
          .click()
          .wait([
            '@GETNodeLinksQuery',
            '@GETNodesWorkPackageQuery2',
            '@GETWorkPackageNodeTags',
            '@POSTWorkPackageNodesGroupSet'
          ]);
        cy.get('[data-qa=spinner]').should('not.be.visible');
      });
    });
});
