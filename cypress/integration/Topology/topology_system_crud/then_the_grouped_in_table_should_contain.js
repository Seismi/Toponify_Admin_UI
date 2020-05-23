const { then } = require('cypress-cucumber-preprocessor/steps');

then('the user adds system {string} to group {string}', function(system, group) {
  cy.get('[data-qa=grouped-in-table-add-to-group]')
    .click()
    .then(() => {
      cy.selectDropDownNoClick('select-modal-search', group).then(() => {
        cy.get('[data-qa=select-modal-confirm')
          .click()
          .wait([
            '@GETNodesWorkPackageQuery',
            '@GETNodeLinksWorkPackageQuery',
            '@GETNodesScopes',
            '@GETNodesWorkPackageQuery2',
            '@GETNodesReportWorkPackageQuery',
            '@GETWorkPackageNodeTags'
          ]);
      });
    });
});
