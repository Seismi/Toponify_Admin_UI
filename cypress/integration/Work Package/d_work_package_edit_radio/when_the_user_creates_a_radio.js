import { When, Then } from 'cypress-cucumber-preprocessor/steps';
const work_package_settings = require('../../common/Work Package/work_package_settings');

When(
  'DEPRECATE the user creates a radio with title {string}, category {string}, status {string}, description {string} which is assigned to {string} and should be actioned by {string} and mitigation resolution {string} and have severity {int} and probability {int} against work package {string}',
  function(title, category, status, description, assigned, actioned, mitigation, severity, probability, work_package) {
    // and have severity {string} and probability (string)
    title = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(title); // append the branch to the name

    cy.get('[data-qa=work-packages-radio-table-add')
      .click()
      .wait('@POSTradiosAdvancedSearch')
      .then(() => {
        cy.get('[data-qa=work-packages-radio-modal-new]')
          .click()
          .then(() => {
            writeRadioDetails(
              title,
              category,
              status,
              assigned,
              severity,
              probability,
              actioned,
              description,
              mitigation
            );
            cy.get('[data-qa=radio-modal-save]')
              .click()
              .wait(['@POSTRadios', '@GETWorkPackage']);
          });
      });
  }
);

When(
  'DEPRECATE the user updates the radio with title {string} to have new title {string}, category {string}, status {string}, description {string} which is assigned to {string} and should be action by {string} and mitigation resolution {string} and have severity {int} and probability {int} against work package {string}',
  function(
    title,
    newTitle,
    category,
    status,
    description,
    assigned,
    actioned,
    mitigation,
    severity,
    probability,
    work_package
  ) {
    work_package = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(work_package); // append the branch to the name
    title = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(title); // append the branch to the name
    newTitle = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(newTitle); // append the branch to the name
    cy.reload()
      .wait(['@GETWorkPackages', '@GETWorkPackage', '@GETUsers'])
      .then(() => {
        cy.findWorkPackage(work_package, false).then(() => {
          cy.selectRow('work-packages-table', work_package) // select the correct row
            .then(() => {
              cy.selectDetailsPaneTab(work_package_settings['tabs']['Radio']).then(() => {
                cy.findWorkPackageRadio(title)
                  .find('tr') // find the first cell
                  .contains('td', title)
                  .get('[data-qa=work-packages-radio-table-open]')
                  .click()
                  .wait(['@GETUsers', '@GETRadio'])
                  .then(() => {
                    cy.get('[data-qa=radio-detail-edit]')
                      .click()
                      .then(() => {
                        writeRadioDetails(
                          newTitle,
                          category,
                          status,
                          assigned,
                          severity,
                          probability,
                          actioned,
                          description,
                          mitigation
                        );
                        cy.get('[data-qa=radio-detail-save]').click();
                      });
                  });
              });
            });
        });
      });
  }
);

Then(
  'DEPRECATE the radio with title {string} should have category {string}, status {string}, description {string} be assigned to {string}, should be actioned by {string}, with mitigation resolution {string}, severity {int} and probability {int} against work package {string}',
  function(title, category, status, description, assigned, actioned, mitigation, severity, probability, work_package) {
    work_package = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(work_package); // append the branch to the name
    title = Cypress.env('BRANCH')
      .concat(' | ')
      .concat(title); // append the branch to the name
    cy.reload()
      .wait(['@GETWorkPackages', '@GETWorkPackage', '@GETUsers'])
      .then(() => {
        cy.findWorkPackage(work_package, false).then(() => {
          cy.selectRow('work-packages-table', work_package) // select the correct row
            .then(() => {
              cy.selectDetailsPaneTab(work_package_settings['tabs']['Radio']).then(() => {
                cy.findWorkPackageRadio(title)
                  .find('tr') // find the first cell
                  .contains('td', title)
                  .get('[data-qa=work-packages-radio-table-open]')
                  .click()
                  .wait(['@GETUsers', '@GETRadio'])
                  .then(() => {
                    assertRadioDetails(
                      title,
                      category,
                      status,
                      assigned,
                      severity,
                      probability,
                      actioned,
                      description,
                      mitigation
                    );
                  });
              });
            });
        });
      });
  }
);

Then('DEPRECATE the radio with title {string} should be immediately visible in the work package radio table', function(
  title
) {
  title = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(title); // prefix the branch to objective
  cy.assertRowExists('work-packages-radio-table', title); // assert row exists
});

Then('DEPRECATE the radio with title {string} should be visible after reload in the work package radio table', function(
  title
) {
  title = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(title); // prefix the branch to objective
  cy.reload()
    .wait(['@GETWorkPackages', '@GETWorkPackage', '@GETUsers'])
    .then(() => {
      cy.findWorkPackage(title, false).then(() => {
        cy.selectDetailsPaneTab(work_package_settings['tabs']['Radio']).then(() => {
          cy.assertRowExists('work-packages-radio-table', title); // assert row exists
        });
      });
    });
});

function selectDropDown(dropdown, value) {
  cy.get(`[data-qa=${dropdown}]`)
    .click()
    .then(() => {
      cy.get('mat-option')
        .contains(value)
        .click({ force: true });
    });
}

function assertRadioDetails(
  title,
  category,
  status,
  assigned,
  severity,
  probability,
  actioned,
  description,
  mitigation
) {
  // Asserts the value of the form are as expected
  cy.get(`[data-qa='radio-detail-category']`).then(input => {
    expect(input[0].textContent).to.equal(category);
  });
  cy.get(`[data-qa='radio-detail-status']`).then(input => {
    expect(input[0].textContent).to.equal(status);
  });
  cy.get(`[data-qa='radio-detail-action-by']`).then(input => {
    const newDate = new Date(actioned).toDateString();
    expect(input[0].value).to.equal(newDate);
  });
  cy.get(`[data-qa='radio-detail-description']`).then(input => {
    expect(input[0].textContent).to.equal(description);
  });
  cy.get('[data-qa=radio-detail-title]').then(input => {
    expect(input[0].value).to.equal(title);
  });
  //TODO uncomment when bug fixed (https://toponify.atlassian.net/browse/TOP-567)
  /*cy.get(`[data-qa='radio-detail-assigned-to']`).then((input)=>{
        expect(input[0].textContent).to.equal(assigned)
    })*/
  cy.get(`[data-qa='radio-detail-mitigation']`).then(input => {
    expect(input[0].textContent).to.equal(mitigation);
  });
  cy.get('[data-qa=radio-detail-severity]').should('have.attr', 'aria-valuenow', severity.toString());
  cy.get('[data-qa=radio-detail-frequency]').should('have.attr', 'aria-valuenow', probability.toString());
}

function writeRadioDetails(
  title,
  category,
  status,
  assigned,
  severity,
  probability,
  actioned,
  description,
  mitigation
) {
  //TODO - Undo when bug fixed (https://toponify.atlassian.net/browse/TOP-567)
  //selectDropDown('radio-detail-assigned-to', assigned)

  cy.get('[data-qa=radio-detail-title]')
    .scrollIntoView()
    .clear({ force: true })
    .type(title)
    .should('have.value', title)
    .then(() => {
      selectDropDown('radio-detail-category', category);
    })
    .then(() => {
      selectDropDown('radio-detail-status', status);
    })
    .then(() => {
      cy.get('[data-qa=radio-detail-severity]')
        .type('{home}')
        .then(() => {
          if (severity - 1 > 0) {
            //scaled from 1 to 5. home commands takes to 1 therefore setting to 1 needs zero right arrows
            cy.get('[data-qa=radio-detail-severity]').type('{rightarrow}'.repeat(severity - 1));
          }
        });
    })
    .then(() => {
      cy.get('[data-qa=radio-detail-frequency]')
        .type('{home}')
        .then(() => {
          if (probability - 1 > 0) {
            cy.get('[data-qa=radio-detail-frequency]').type('{rightarrow}'.repeat(probability - 1));
          }
        });
    })
    .then(() => {
      cy.get('[data-qa=radio-detail-action-by')
        .clear({ force: true })
        .type(actioned)
        .should('have.value', actioned);
    })
    .then(() => {
      cy.type_ckeditor('[data-qa=radio-detail-description]', description);
    })
    .then(() => {
      cy.type_ckeditor('[data-qa=radio-detail-mitigation]', mitigation);
    });
}
