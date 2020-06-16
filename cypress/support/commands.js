// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
const login = require('../integration/common/Login/login_settings');
const workPackage = require('../integration/common/Work Package/work_package_settings');
const documentationStandards = require('../integration/common/Documentation Standards/documentation_standards_settings');

Cypress.Commands.add('login', usertype => {
  cy.setUpRoutes('Login', login);
  const usertypes = {
    validuser: {
      username: 'regression.test.core@toponify.com',
      password: 'P1ssw4rd!'
    },
    invaliduser: {
      username: 'a@b.net',
      password: 'incorrect'
    }
  };

  cy.visit('/#/auth/login?returnUrl=%2Fhome').then(() => {
    cy.get('input[data-qa=auth-login-user-name]')
      .type(usertypes[usertype].username)
      .should('have.value', usertypes[usertype].username);
    cy.get('input[data-qa=auth-login-password')
      .type(usertypes[usertype].password)
      .should('have.value', usertypes[usertype].password)
      .then(() => {
        cy.get('button[data-qa=auth-login-login]')
          .click()
          .wait('@POSTlogin')
          .then(response => {
            if (response.status === 200)
              cy.wait(['@GETnavigateMyWorkPackages', '@GETnavigateMyRadios', '@GETnavigateMyLayouts', '@GETMyProfile']);
          });
      });
  });
});

Cypress.Commands.add('selectDropDownNoClick', (dropdown, element) => {
  cy.get(`[data-qa=${dropdown}]`)
    .click()
    .get('mat-option')
    .contains(element)
    .click({ force: true });
});

Cypress.Commands.add('selectDropDown', (dropdown, element) => {
  cy.get(`[data-qa=${dropdown}]`)
    .click()
    .get('mat-option')
    .contains(element)
    .click({ force: true })
    .then(() => {
      cy.get(`[data-qa=${dropdown}]`).type('{esc}');
    });
});

Cypress.Commands.add('selectDropDownWaitFor', (dropdown, element, wait) => {
  cy.get(`[data-qa=${dropdown}]`)
    .click()
    .get('mat-option')
    .contains(element)
    .click({ force: true })
    .wait(wait)
    .then(() => {
      cy.get(`[data-qa=${dropdown}]`).type('{esc}');
    });
});

Cypress.Commands.add('selectDropDownSearchable', (dropdown, element) => {
  cy.get(`[data-qa=${dropdown}]`)
    .click()
    .then(() => {
      cy.get('.mat-autocomplete-panel')
        .find('.mat-option')
        .contains(` ${element} `)
        .click({ force: true });
      //cy.get(`[data-qa=${dropdown}]`).type('{esc}')
    });
});

Cypress.Commands.add('selectRow', (table, contents) => {
  return cy
    .get(`[data-qa=${table}]`)
    .find('table>tbody')
    .contains('td', contents)
    .click({ force: true });
});

Cypress.Commands.add('type_ckeditor', (element, content) => {
  cy.get(element)
    .find('[contenteditable=true]')
    .clear()
    .type(content);
});

Cypress.Commands.add('assertRowExists', (table, contents) => {
  return cy
    .get(`[data-qa=${table}]`)
    .find('table>tbody')
    .contains('td', contents)
    .should('exist');
});

Cypress.Commands.add('assertRowDoesNotExist', (table, contents) => {
  return cy
    .get(`[data-qa=${table}]`)
    .find('table>tbody')
    .contains('td', contents)
    .should('not.exist');
});

Cypress.Commands.add(
  'shouldHaveTrimmedText',
  {
    prevSubject: true
  },
  (subject, equalTo) => {
    if (isNaN(equalTo)) {
      expect(subject.text().trim()).to.eq(equalTo);
    } else {
      expect(parseFloat(subject.text())).to.eq(equalTo);
    }
    return subject;
  }
);

Cypress.Commands.add('selectDetailsPaneTab', posinset => {
  return cy
    .get('[class=rightPane]') //get the right pane
    .within(() => {
      // all commands within
      cy.get(`[aria-posinset=${posinset}]`) // get the correct tab
        .click(); //click
    });
});

Cypress.Commands.add('findWorkPackage', (name, includeArchived) => {
  if (includeArchived) {
    cy.get('[data-qa=work-packages-archive-toggle]') // get the archive toggle
      .find('label>div>input')
      .uncheck({ force: true })
      .check({ force: true });
  } else {
    cy.get('[data-qa=work-packages-archive-toggle]') // get the archive toggle
      .find('label>div>input')
      .check({ force: true })
      .uncheck({ force: true });
  }
  cy.wait('@GETArchiveWorkPackages.all'); // wait for the return of the archive work packages
  cy.get(`[data-qa=work-packages-quick-search]`) // get the quick packages search
    .clear() //clear the box
    .type(name)
    .should('have.value', name) // type the name
    .then(() => {
      return cy
        .get(`[data-qa=work-packages-table]`) // get the work packages table
        .find('table>tbody'); // find the table
    });
});

Cypress.Commands.add('findDocumentationStandard', name => {
  cy.get(`[data-qa=documentation-standards-quick-search]`) // get the quick packages search
    .clear() //clear the box
    .type(name) // type the name
    .then(() => {
      return cy
        .get(`[data-qa=documentation-standards-table]`) // get the work packages table
        .find('table>tbody'); // find the table
    });
});

Cypress.Commands.add('findScope', name => {
  cy.get(`[data-qa=scopes-and-layouts-scope-table]`)
    .find(`[data-qa=scopes-and-layouts-quick-search]`) // get the quick packages search
    .clear() //clear the box
    .type(name)
    .should('have.value', name) // type the name
    .then(() => {
      return cy
        .get(`[data-qa=scopes-and-layouts-scope-table]`) // get the work packages table
        .find('table>tbody'); // find the table
    });
});

Cypress.Commands.add('selectTableFirstRow', (search_term, search, table) => {
  cy.get(`[data-qa=${search}]`)
    .clear()
    .type(search_term)
    .should('have.value', search_term)
    .then(() => {
      cy.get(`[data-qa=${table}]`).find('table>tbody>tr :first');
    });
});

Cypress.Commands.add('findWorkPackageRadio', name => {
  cy.get(`[data-qa=work-packages-radio-table-quick-search]`) // get the quick packages search
    .clear() //clear the box
    .type(name)
    .should('have.value', name); //type the name
  return cy
    .get(`[data-qa=work-packages-radio-table]`) // get the work packages table
    .find('table>tbody'); // find the table
});

Cypress.Commands.add('selectUser', email => {
  cy.get('[data-qa=settings-all-users-quick-search]')
    .clear()
    .type(email)
    .should('have.value', email)
    .then(() => {
      cy.get(`[data-qa=all-users-table]`).find('table>tbody>tr :first');
    });
});

Cypress.Commands.add('selectTeam', team => {
  cy.get('[data-qa=settings-teams-quick-search]')
    .clear()
    .type(team)
    .should('have.value', team)
    .then(() => {
      cy.get(`[data-qa=settings-teams-table]`).find('table>tbody>tr :first');
    });
});

Cypress.Commands.add('setUpRoutes', (page, settings) => {
  let route;
  cy.server();
  Object.keys(settings.wait_for).forEach(r => {
    route = settings.wait_for[r];
    if (route.hasOwnProperty('stub')) {
      cy.route(route.method, route.api, route.stub).as(`${route.method}${route.name}`);
    } else {
      cy.route(route.method, route.api).as(`${route.method}${route.name}`);
    }
  });
});

Cypress.Commands.add('editWorkPackageTopology', work_package => {
  cy.get('[data-qa=left-hand-pane-work-packages]').click();
  cy.get('[data-qa=left-hand-pane-work-package-table]')
    .within(() => {
      cy.get('div>div>input')
        .clear()
        .type(work_package)
        .should('have.value', work_package)
        .then(() => {
          cy.get('table>tbody')
            .find('tr:first>td>div>div>mat-icon')
            .then(wp => {
              console.log(wp[0].textContent);
              if (wp[0].textContent === 'edit') {
                cy.get('table>tbody')
                  .find('tr:first>td>div>div>mat-icon')
                  .click();
                cy.wait([
                  '@GETNodesWorkPackageQuery',
                  '@GETNodeLinksWorkPackageQuery',
                  '@GETSelectorAvailabilityQuery'
                ]);
                cy.get('[data-qa=spinner]').should('not.be.visible');
              }
            });
        });
    })
    .then(result => {
      cy.root()
        .get('[data-qa=left-hand-pane-work-packages]')
        .click();
    });
});

Cypress.Commands.add('editWorkPackage', (work_package, work_package_menu, wait_for) => {
  cy.get('[data-qa=left-hand-pane-work-packages]').click();
  cy.get(`[data-qa=${work_package_menu}]`)
    .within(() => {
      cy.get('div>div>input')
        .clear()
        .type(work_package)
        .should('have.value', work_package)
        .then(() => {
          cy.get('table>tbody')
            .find('tr:first>td>div>div>mat-icon')
            .click()
            .wait(['@GETNodesWorkPackageQuery', '@GETNodeLinksWorkPackageQuery', '@GETSelectorAvailabilityQuery'])
            .then(wp => {
              if (wp[0].textContent === 'edit') {
                cy.get('table>tbody')
                  .find('tr:first>td>div>div>mat-icon')
                  .click()
                  .wait(wait_for);
              }
            });
        });
    })
    .then(result => {
      cy.get('[data-qa=spinner]').should('not.be.visible');
      cy.root()
        .get('[data-qa=left-hand-pane-work-packages]')
        .click();
    });
});

Cypress.Commands.add('deleteScope', scope => {
  cy.selectRow('scopes-and-layouts-scope-table', scope)
    //.wait('@GETWorkPackage')
    .then(() => {
      cy.get('table>tbody>tr :first') // get the table body
        .click()
        .wait(['@GETScope', '@GETLayout'])
        .then(() => {
          cy.get('[data-qa=scopes-and-layouts-delete]')
            .click()
            .then(() => {
              cy.get('[data-qa=delete-modal-yes]').click();
            });
        });
    });
});

Cypress.Commands.add('deleteDocumentationStandard', doc_standard => {
  cy.selectRow('documentation-standards-table', doc_standard) // select the documentation standard
    .wait('@GETCustomProperties*')
    .then(() => {
      cy.get(`[data-qa=documentation-standards-delete]`) //get the delete button
        .click() // click it
        .then(() => {
          cy.get('[data-qa=delete-modal-yes]') // get the delete modal button
            .click()
            .then(() => {
              cy.wait('@DELETECustomProperties'); // delete the documentation standard
            });
        });
    });
});

Cypress.Commands.add('deleteWorkPackage', name => {
  cy.selectRow('work-packages-table', name)
    .wait('@GETWorkPackage')
    .then(() => {
      cy.selectDetailsPaneTab(workPackage['tabs']['Details']).then(() => {
        cy.get('tbody>tr') // get the table body
          .filter('.highlight') //find the highlighted row
          .get('td') // get the second td
          .eq(2)
          .then(status => {
            switch (
              status[0].textContent // depending on status
            ) {
              case 'approved':
              case 'submitted':
                cy.get(`[data-qa=work-packages-reset]`).click(); //reset the package and fall through to the delete
              case 'draft':
              case 'superseded':
                cy.get(`[data-qa=work-packages-delete]`) // delete the work package
                  .click()
                  .then(() => {
                    cy.get('[data-qa=delete-modal-yes]')
                      .click()
                      .wait('@DELETEWorkPackage'); // confirm the delete
                  });
                break;
            }
          });
      });
    });
});

Cypress.Commands.add('createDocumentationStandard', (doc_standard, type, component) => {
  // Creates a documentation standard
  cy.get('[data-qa=documentation-standards-create-new]')
    .click()
    .then(() => {
      cy.get('[data-qa=documentation-standards-details-name]').type(doc_standard); // enter the name
      cy.get('[data-qa=documentation-standards-details-description]').type(doc_standard); //enter the description
      cy.root(); // return to root
      cy.get(`[data-qa=documentation-standards-details-type]`) // get the type drop down
        .click()
        .get('mat-option')
        .contains(type) // get the mat-option that contains type
        .click({ force: true }); // click
      cy.get('smi-document-standards-levels') // get the levels
        .get(component === 'Everywhere' ? 'mat-checkbox' : 'mat-tree-node') // get the tree node.  Everywhere is a special case and is a mat-check-box
        .contains(component) // which contains the component
        .click();
    }); //click the create new documentations standard button
});

Cypress.Commands.add('findRadio', radio => {
  cy.get('[data-qa=radio-filter]')
    .click()
    .then(() => {
      cy.get('[data-qa=radio-filter-text]')
        .clear()
        .type(radio);
      cy.get('[data-qa=radio-filter-modal-apply]')
        .click({ force: true })
        .wait(['@POSTradiosAdvancedSearch'])
        .then(() => {
          return cy.get(`[data-qa=radio-table]`).find('table>tbody');
        });
    });
});

Cypress.Commands.add('deleteRadio', radio => {
  cy.selectRow('radio-table', radio)
    .wait('@GETRadio')
    .then($radio => {
      const status = $radio.response.body.data.status;
      if (status === 'closed') {
        cy.get('[data-qa=radio-detail-delete]').click();
        cy.get('[data-qa=delete-modal-yes]')
          .click()
          .wait('@DELETERadios');
      } else {
        cy.get('[data-qa=radio-detail-archive]')
          .click()
          .then(() => {
            cy.type_ckeditor('[data-qa=radio-discussions-tab-your-message]', 'Closing RADIO');
            cy.get('[data-qa=radio-reply-modal-save]')
              .click()
              .wait('@POSTRadioReply');
          });
        cy.get('[data-qa=radio-detail-delete]').click();
        cy.get('[data-qa=delete-modal-yes]')
          .click()
          .wait('@DELETERadios');
      }
    });
});

Cypress.Commands.add(
  'writeRadioDetails',
  (title, category, status, assigned, severity, probability, actioned, description, mitigation) => {
    //TODO - Undo when bug fixed (https://toponify.atlassian.net/browse/TOP-567)
    //selectDropDown('radio-detail-assigned-to', assigned)

    cy.get('[data-qa=radio-detail-title]')
      .scrollIntoView()
      .clear()
      .type(title)
      .should('have.value', title)
      .then(() => {
        cy.selectDropDownNoClick('radio-detail-category', category);
      })
      .then(() => {
        cy.selectDropDownNoClick('radio-detail-status', status);
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
        if (actioned.length > 0) {
          cy.get('[data-qa=radio-detail-action-by')
            .clear()
            .type(actioned)
            .should('have.value', actioned);
        }
      })
      .then(() => {
        if (description.length > 0) {
          cy.type_ckeditor('[data-qa=radio-detail-description]', description);
        }
      })
      .then(() => {
        if (mitigation.length > 0) {
          cy.type_ckeditor('[data-qa=radio-detail-mitigation]', mitigation);
        }
      });
  }
);

Cypress.Commands.add(
  'assertRadioDetails',
  (title, category, status, assigned, severity, probability, actioned, description, mitigation) => {
    // Asserts the value of the form are as expected
    cy.get(`[data-qa='radio-detail-category']`).then(input => {
      expect(input[0].textContent).to.equal(category);
    });
    cy.get(`[data-qa='radio-detail-status']`).then(input => {
      expect(input[0].textContent).to.equal(status);
    });
    cy.get(`[data-qa='radio-detail-action-by']`).then(input => {
      const newDate = actioned !== '' ? new Date(actioned).toDateString() : actioned;
      cy.log(`${input[0].value} to equal ${newDate}`).then(() => {
        expect(input[0].value).to.equal(newDate);
      });
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
);

Cypress.Commands.add('assertDetailsForm', (reference, name, description, category) => {
  if (reference.length > 0) cy.get('[data-qa=object-details-reference]').should('have.value', reference);
  cy.get('[data-qa=object-details-name]').should('have.value', name);
  if (reference.description > 0) cy.get('[data-qa=object-details-description]').should('have.value', description);
  if (reference.category > 0)
    cy.get('[data-qa=object-details-category]')
      .find('.mat-select-value>span>span')
      .should('have.text', category);
});

Cypress.Commands.add('checkTopologyTable', (component, component_type, test) => {
  component = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(component); // add the branch to the name
  let table = component_type === 'system' ? 'components' : 'links';
  cy.get('[data-qa=topology-table-quick-search]')
    .clear()
    .type(component)
    .should('have.value', component);
  cy.get(`[data-qa=topology-table-${table}]`)
    .find('table>tbody')
    .contains(component)
    .should(test);
});

Cypress.Commands.add('assertComponentExistsOnCanvas', (component_type, component) => {
  component = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(component); // add the branch to the name
  let result;
  let component_array = component_type === 'system' ? 'nodeDataArray' : 'linkDataArray';
  cy.window().then(window => {
    let dataArray = window.MyRobot.diagram.model[component_array];
    result = dataArray.filter(components => {
      return components.name === component;
    });
    expect(result.length).to.be.greaterThan(0);
  });
});

Cypress.Commands.add('findDocumentStandard', title => {
  cy.get('[data-qa=documentation-standards-quick-search]')
    .clear()
    .type(title);
  return cy.get(`[data-qa=documentation-standards-table]`).find('table>tbody');
});

Cypress.Commands.add('deleteDocumentStandard', doc_standard => {
  cy.selectRow('documentation-standards-table', doc_standard).then(() => {
    cy.get(`[data-qa=documentation-standards-delete]`)
      .click()
      .then(() => {
        cy.get('[data-qa=delete-modal-yes]')
          .click()
          .then(() => {
            cy.wait('@DELETECustomProperties');
          });
      });
  });
  cy.get('[data-qa=documentation-standards-quick-search]')
    .clear()
    .type(doc_standard);
});

Cypress.Commands.add('createDocumentationStandard', (doc_standard, type, component) => {
  cy.get('[data-qa=documentation-standards-create-new]')
    .click()
    .then(() => {
      cy.get('[data-qa=documentation-standards-details-name]')
        .type(doc_standard)
        .should('have.value', doc_standard);
      cy.get('[data-qa=documentation-standards-details-description]')
        .type(doc_standard)
        .should('have.value', doc_standard);
      cy.root();
      cy.get(`[data-qa=documentation-standards-details-type]`)
        .click()
        .get('mat-option')
        .contains(type)
        .click({ force: true });
      cy.get('smi-document-standards-levels')
        .get('mat-tree-node')
        .contains(component)
        .click();
      cy.get('[data-qa=documentation-standards-modal-save]')
        .click()
        .then(() => {
          cy.route('POST', `${documentationStandards}`).as('POSTCustomProperties');
        });
    });
});

Cypress.Commands.add('findDocumentStandard', title => {
  cy.get('[data-qa=documentation-standards-quick-search]')
    .clear()
    .type(title);
  return cy.get(`[data-qa=documentation-standards-table]`).find('table>tbody');
});

Cypress.Commands.add('deleteDocumentStandard', title => {
  cy.selectRow('documentation-standards-table', title);
  cy.route('GET', `${documentationStandards}`)
    .as('GETCustomProperties')
    .then(() => {
      cy.get('[data-qa=documentation-standards-delete]')
        .click()
        .then(() => {
          cy.get('[data-qa=delete-modal-yes]')
            .click()
            .then(() => {
              cy.route('DELETE', `${documentationStandards}`).as('DELETECustomProperties');
            });
        });
    });
  cy.get('[data-qa=documentation-standards-quick-search]')
    .clear()
    .type(title);
});

//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
