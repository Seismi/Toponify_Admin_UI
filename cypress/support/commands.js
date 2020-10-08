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
const attributesOrRules = require('../integration/common/Attribute and Rules/attribute_and_rules_settings');

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
      .paste(usertypes[usertype].username)
      .should('have.value', usertypes[usertype].username);
    cy.get('input[data-qa=auth-login-password')
      .paste(usertypes[usertype].password)
      .should('have.value', usertypes[usertype].password)
      .then(() => {
        cy.get('button[data-qa=auth-login-login]')
          .click()
          .wait('@POSTlogin')
          .then(response => {
            if (response.status === 200)
              cy.wait(['@GETnavigateMyWorkPackages', '@GETnavigateMyRadios', '@GETMyProfile.all']);
          });
      });
  });
});

Cypress.Commands.add('selectDropDownNoClick', (dropdown, element) => {
  cy.get(`[data-qa=${dropdown}]`)
    .click()
    .get('mat-option')
    .contains(element)
    .should('exist')
    .click({ force: true });
});

Cypress.Commands.add('selectDropDown', (dropdown, element) => {
  cy.get(`[data-qa=${dropdown}]`).then(result => {
    if (result[0].innerText.indexOf(element) === -1) {
      cy.get(`[data-qa=${dropdown}]`)
        .click()
        .get('mat-option')
        .should('be.visible')
        .contains(element)
        .click({ force: true })
        .then(() => {
          cy.get(`[data-qa=${dropdown}]`).type('{esc}');
        });
    }
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
    .clear({ force: true })
    .type(content);
});

Cypress.Commands.add('assertRowExists', (table, contents) => {
  return cy
    .get(`[data-qa=${table}]`)
    .should('exist')
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
  let currentSetting, currentSearchTerm, wait;
  cy.log('findWorkPackage');
  cy.get('[data-qa=work-packages-archive-toggle]')
    .find('label>div>input')
    .then(result => {
      currentSetting = result[0].checked;
    });
  cy.get('[data-qa=work-packages-quick-search]').then(result => {
    currentSearchTerm = result[0].value;
    wait = currentSearchTerm === name ? false : true;
  });

  if (includeArchived) {
    // if we want archived work packages
    if (!currentSetting) {
      // if we don't currently have archived package selected
      cy.get('[data-qa=work-packages-archive-toggle]') // get the archive toggle
        .find('label>div>input')
        .check({ force: true })
        .wait('@GETWorkPackagePaging');
    }
  } else {
    //we don't want archived packages
    if (currentSetting) {
      // if we currently have archived package selected
      cy.get('[data-qa=work-packages-archive-toggle]') // get the archive toggle
        .find('label>div>input')
        .uncheck({ force: true })
        .wait('@GETWorkPackagePaging');
    }
  }
  cy.get('[data-qa=spinner]').should('not.be.visible');
  cy.get(`[data-qa=work-packages-quick-search]`) // get the quick packages search
    .clear({ force: true }) //clear the box
    .paste(name)
    .should('have.value', name) // type the name
    .then(() => {
      if (wait) {
        cy.wait(2000);
        cy.wait('@GETWorkPackagePaging', { requestTimeout: 5000 });
        cy.get('[data-qa=spinner]').should('not.be.visible');
      }
    })
    .then(() => {
      return cy
        .get(`[data-qa=work-packages-table]`) // get the work packages table
        .find('table>tbody'); // find the table
    });
});

Cypress.Commands.add('findReport', name => {
  cy.get(`[data-qa=reports-quick-search]`) // get the quick packages search
    .clear({ force: true }) //clear the box
    .paste(name) // type the name
    .wait(3000)
    .wait('@GETReportsFilterQuery', { requestTimeout: 5000 })
    .then(() => {
      return cy
        .get(`[data-qa="reports-table"]`) // get the work packages table
        .find('table>tbody'); // find the table
    });
});

Cypress.Commands.add('selectTableFirstRow', (search_term, search, table) => {
  cy.get(`[data-qa=${search}]`)
    .clear({ force: true })
    .paste(search_term)
    .should('have.value', search_term)
    .then(() => {
      cy.wait(1000);
      return cy
        .get(`[data-qa=${table}]`)
        .find('table>tbody')
        .contains('td', search_term);
    });
});

Cypress.Commands.add('findWorkPackageRadio', name => {
  cy.get(`[data-qa=work-packages-radio-table-quick-search]`) // get the quick packages search
    .clear({ force: true }) //clear the box
    .paste(name)
    .should('have.value', name)
    .wait(1000); //type the name
  return cy
    .get(`[data-qa=work-packages-radio-table]`) // get the work packages table
    .find('table>tbody'); // find the table
});

Cypress.Commands.add('selectUser', email => {
  cy.get('[data-qa=settings-all-users-quick-search]')
    .clear({ force: true })
    .paste(email)
    .should('have.value', email)
    .then(() => {
      cy.get(`[data-qa=all-users-table]`).find('table>tbody>tr :first');
    });
});

Cypress.Commands.add('selectTeam', team => {
  cy.get('[data-qa=settings-teams-quick-search]')
    .clear({ force: true })
    .paste(team)
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
  cy.get('[data-qa=topology-work-packages-quick-search]')
    .clear()
    .paste(work_package)
    .should('have.value', work_package)
    .then(() => {
      cy.get('[data-qa=topology-work-packages-edit]')
        .click()
        .then(() => {
          cy.wait(['@GETNodesQuery', '@GETNodeLinksQuery', '@GETSelectorAvailabilityQuery']);
          cy.get('[data-qa=spinner]').should('not.be.visible');
        });
    })
    .then(result => {
      cy.root()
        .get('[data-qa=left-hand-pane-work-packages]')
        .click();
    });
});

Cypress.Commands.add('editWorkPackage', (work_package, work_package_menu, wait_for) => {
  cy.get('[data-qa=left-hand-pane-work-packages]')
    .click()
    .get(`[data-qa=${work_package_menu}]`)
    .within(() => {
      cy.get('[data-qa=topology-work-packages-quick-search]')
        .clear()
        .paste(work_package)
        .should('have.value', work_package)
        .then(() => {
          cy.get('[data-qa=topology-work-packages-edit]').click();
          if (wait_for) {
            cy.wait(wait_for);
          }
        });
    })
    .then(result => {
      cy.get('[data-qa=spinner]').should('not.be.visible');
      cy.root()
        .get('[data-qa=left-hand-pane-work-packages]')
        .click();
      //  .wait('@PUTLayoutNodes');
    });
  /*    .then(() => {
    });*/
});

Cypress.Commands.add('displayWorkPackage', (work_package, work_package_menu, wait_for, action) => {
  cy.get('[data-qa=left-hand-pane-work-packages]').click();
  cy.get(`[data-qa=${work_package_menu}]`)
    .within(() => {
      cy.get('[data-qa=topology-work-packages-quick-search]')
        .clear()
        .paste(work_package)
        .should('have.value', work_package)
        .then(() => {
          if (action === 'check') {
            cy.get('[data-qa=topology-work-packages-select-work-package]')
              .click({ force: true })
              .wait(wait_for);
          } else {
            cy.get('[data-qa=topology-work-packages-off]')
              .click()
              .wait('@GETSelectorAvailabilityQuery');
          }
        });
    })
    .then(result => {
      cy.get('[data-qa=spinner]').should('not.be.visible');
      cy.root()
        .get('[data-qa=left-hand-pane-work-packages]')
        .click();
    });
});

Cypress.Commands.add('findScope', name => {
  cy.get(`[data-qa=scopes-and-layouts-scope-table]`)
    .find(`[data-qa=scopes-and-layouts-quick-search]`) // get the quick packages search
    .clear({ force: true }) //clear the box
    .paste(name)
    .should('have.value', name) // type the name
    .wait(1000)
    .wait('@GETScopes.all')
    .then(() => {
      return cy
        .get(`[data-qa=scopes-and-layouts-scope-table]`) // get the work packages table
        .find('table>tbody'); // find the table
    });
});

Cypress.Commands.add('findSystem', (table, name) => {
  cy.get(`[data-qa=${table}]`)
    .find(`[data-qa=topology-table-quick-search]`) // get the quick packages search
    .clear({ force: true }) //clear the box
    .type(name)
    .should('have.value', name) // type the name#
    .then(() => {
      cy.get(`[data-qa=${table}]`) // get the work packages table
        .contains('td', name)
        .should('be.visible');
      return cy.get(`[data-qa=${table}]`).find('table>tbody'); // find the table
    });
});

Cypress.Commands.add('findRadio', radio => {
  cy.get('[data-qa=radio-header-filter]')
    .click()
    .then(() => {
      cy.get('[data-qa=radio-filter-text]')
        .clear({ force: true })
        .paste(radio);
      cy.selectDropDown('radio-filter-status', 'open');
      cy.selectDropDown('radio-filter-status', 'closed');
      cy.selectDropDown('radio-filter-status', 'new');
      cy.get('[data-qa=radio-filter-modal-apply]')
        .click({ force: true })
        .wait(3000)
        .wait('@POSTradiosAdvancedSearch')
        .then(() => {
          cy.get('[data-qa=spinner]').should('not.be.visible');
          cy.get('[data-qa=details-spinner]').should('not.be.visible');
          return cy.get(`[data-qa=radio-table]`).find('table>tbody');
        });
    });
});

Cypress.Commands.add('findRadioAPI', radio => {
  cy.get('[data-qa=radio-header-filter]')
    .click()
    .then(() => {
      cy.get('[data-qa=radio-filter-text]')
        .clear({ force: true })
        .paste(radio);
      cy.get('[data-qa=radio-filter-modal-apply]')
        .click({ force: true })
        .wait(3000)
        .wait('@POSTradiosAdvancedSearch')
        .then(xhr => {
          return xhr.response.body.data;
        });
    });
});

Cypress.Commands.add('findDocumentationStandard', (name, wait) => {
  cy.get(`[data-qa=documentation-standards-quick-search]`) // get the quick packages search
    .scrollIntoView()
    .clear({ force: true })
    .paste(name) // type the name
    .should('have.value', name)
    .wait(1000);
  if (wait) {
    cy.wait('@GETCustomProperties');
  }
  cy.get('[data-qa=details-spinner]').should('not.be.visible');
  return cy
    .get(`[data-qa=documentation-standards-table]`) // get the work packages table
    .find('table>tbody'); // find the table
});

Cypress.Commands.add('deleteScope', scope => {
  cy.selectRow('scopes-and-layouts-scope-table', scope).then(() => {
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
  cy.log('findWorkPackage');
  cy.selectRow('work-packages-table', name)
    .wait(['@GETWorkPackage'], { requestTimeout: 5000 })
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

Cypress.Commands.add('deleteRadio', radio => {
  cy.selectRow('radio-table', radio)
    .wait(['@GETRadio', '@GETRadioTags'])
    .spread((GETRadio, GETRadioTags) => {
      const status = GETRadio.response.body.data.status;
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
          .wait(2000)
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
      .clear({ force: true })
      .paste(title)
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
        cy.selectDropDownNoClick('radio-detail-assigned-to', assigned);
      })
      .then(() => {
        if (actioned.length > 0) {
          cy.get('[data-qa=radio-detail-action-by')
            .clear({ force: true })
            .paste(actioned)
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
    .clear({ force: true })
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
    .clear({ force: true })
    .paste(doc_standard);
});

Cypress.Commands.add('createDocumentationStandard', (doc_standard, type, component) => {
  cy.get('[data-qa=documentation-standards-create-new]')
    .click()
    .then(() => {
      cy.get('[data-qa=documentation-standards-modal-form]')
        .within(() => {
          cy.get('[data-qa=documentation-standards-details-name]')
            .paste(doc_standard)
            .should('have.value', doc_standard);
          cy.get('[data-qa=documentation-standards-details-description]')
            .paste(doc_standard)
            .should('have.value', doc_standard);
          cy.get(`[data-qa=documentation-standards-details-type]`).click();
        })
        .then(() => {
          cy.get(`[data-qa=documentation-standards-details-type]`)
            .get('mat-option')
            .contains(type)
            .click({ force: true });
          cy.get('smi-document-standards-levels')
            .get(component === 'Everywhere' ? 'mat-checkbox' : 'mat-tree-node') // get the tree node.  Everywhere is a special case and is a mat-check-box
            .contains(component)
            .click();
        });
    });
});

Cypress.Commands.add('createReport', (name, description, system) => {
  cy.get('[data-qa=reports-create-new]')
    .click()
    .then(() => {
      cy.wait(['@GETTeams', '@GETReportsFilterQuery']);
      cy.get('[data-qa=spinner]').should('not.be.visible');
      cy.get('[data-qa=reports-details-name]')
        .paste(name)
        .should('have.value', name);
      cy.get('[data-qa=reports-details-description]')
        .paste(description)
        .should('have.value', description);
      cy.selectDropDownNoClick('reports-details-system', system);
    });
});

Cypress.Commands.add('deleteDocumentStandard', title => {
  cy.selectRow('documentation-standards-table', title);
  cy.route('GET', `${documentationStandards}`)
    .as('GETCustomProperties')
    .then(() => {
      cy.get('[data-qa=documentation-standards-delete]')
        .click()
        .wait('@GETCustomProperties*')
        .then(() => {
          cy.get('[data-qa=delete-modal-yes]')
            .click()
            .wait('@DELETECustomProperties');
        });
    });
  cy.get('[data-qa=documentation-standards-quick-search]')
    .clear({ force: true })
    .paste(title);
});

Cypress.Commands.add('addDocStandard', (value, doc_standard, table) => {
  doc_standard = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(doc_standard); // prefix branch to doc standard name
  cy.get(`[data-qa=documentation-standards-table-quick-search]`) // get the quick search
    .clear({ force: true })
    .paste(doc_standard)
    .should('have.value', doc_standard)
    .wait(1000); //enter the documentation standard
  cy.get(`[data-qa=${table}]`) //get the doc standard table
    .find('table>tbody') //find the body
    .contains('tr', doc_standard) // and the row which contains
    .should('have.length', 1) //confirm there is only one documentation standard
    .find(`[data-qa=documentation-standards-table-edit]`) // get the edit button
    .click()
    .get(`[data-qa=documentation-standards-table-value]`) // get the value field
    .clear({ force: true })
    .type(value)
    .should('have.value', value.toString()); // type the value
});

Cypress.Commands.add('addDocStandardBoolean', (value, doc_standard, table) => {
  doc_standard = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(doc_standard); // prefix branch to doc standard name
  cy.get(`[data-qa=documentation-standards-table-quick-search]`) // get the quick search
    .clear({ force: true })
    .paste(doc_standard)
    .should('have.value', doc_standard)
    .wait(1000); //enter the documentation standard  ;
  cy.get(`[data-qa=${table}]`) //get the doc standard table
    .find('table>tbody') //find the body
    .contains('tr', doc_standard) // and the row which contains
    .should('have.length', 1) //confirm there is only one documentation standard
    .find(`[data-qa=documentation-standards-table-edit]`) // get the edit button
    .click();
  cy.selectDropDown('documentation-standards-table-type', value); // select the value
});

Cypress.Commands.add('addDocStandardDate', (value, doc_standard, table) => {
  doc_standard = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(doc_standard); // prefix branch to doc standard name
  cy.get(`[data-qa=documentation-standards-table-quick-search]`) // get the quick search
    .clear({ force: true })
    .paste(doc_standard)
    .should('have.value', doc_standard)
    .wait(2000); //enter the documentation standard
  cy.get(`[data-qa=${table}]`) //get the doc standard table
    .find('table>tbody') //find the body
    .contains('tr', doc_standard) // and the row which contains
    .should('have.length', 1) //confirm there is only one documentation standard
    .find(`[data-qa=documentation-standards-table-edit]`) // get the edit button
    .click()
    .get(`[data-qa=documentation-standards-table-date]`) // get the value field
    .clear({ force: true })
    .paste(value)
    .should('have.value', value.toString()); // type the value
});

Cypress.Commands.add('documentationStandardTest', (doc_standard, value, table) => {
  //Tests the value in a documentation standard test
  doc_standard = Cypress.env('BRANCH')
    .concat(' | ')
    .concat(doc_standard); // prefix the name with branch
  cy.get(`[data-qa=documentation-standards-table-quick-search]`) // search for the documentation standard
    .clear({ force: true })
    .paste(doc_standard)
    .should('have.length', 1) //enter the documentation standard
    .should('have.value', doc_standard);
  cy.get(`[data-qa=${table}]`) //get the table
    .find('table>tbody') // find the table body
    .contains('tr', doc_standard) // row that contains documentation standard
    .find(`td`) //check if a cell has value
    .eq(1)
    .shouldHaveTrimmedText(value); // trims leading and trailing spaces for strings
});

Cypress.Commands.add('findAttributeOrRule', attr => {
  cy.get('[data-qa=rules-and-attributes-quick-search]')
    .clear()
    .paste(attr);
  return cy.get(`[data-qa=rules-and-attributes-table]`).find('table>tbody');
});

Cypress.Commands.add('createAttributeAndRule', (name, description, category) => {
  cy.selectDropDownNoClick('rule-and-attribute-details-category', category)
    .then(() => {
      cy.get('[data-qa=rule-and-attribute-details-name]')
        .should('be.visible')
        .paste(name)
        .should('have.value', name);
    })
    .then(() => {
      cy.get('[data-qa=rule-and-attribute-details-description]')
        .should('be.visible')
        .paste(description)
        .should('have.value', description);
    });
});

Cypress.Commands.add('assertAttributesForm', (category, title, description) => {
  cy.selectDropDownNoClick('attributes-and-rules-details-category', category);
  cy.get('[data-qa=attributes-and-rules-details-name]')
    .clear()
    .paste(title);
  cy.get('[data-qa=attributes-and-rules-details-description]')
    .clear()
    .paste(description);
});

Cypress.Commands.add('selectMenuItem', (dataqa, wait_for) => {
  cy.get(`[data-qa=main-menu-open]`) // get the main menu
    .click()
    .then(() => {
      cy.get(`[data-qa=${dataqa}]`) //get the menu selector
        .click()
        .then(() => {
          cy.wait(wait_for); // wait for API Calls
        });
      cy.get('[data-qa=spinner]').should('not.be.visible');
    });
});

Cypress.Commands.add('saveDocumentationChange', (action, wait_for) => {
  cy.get(`[data-qa=documentation-standards-table-${action}]`) // get the action button
    .click()
    .then(() => {
      cy.wait(wait_for); // wait for the relevant apis
    });
});

Cypress.Commands.add('createWorkPackage', (name, description, baseline, owner) => {
  cy.get(`[data-qa=work-packages-create-new]`)
    .click()
    .wait(['@GETTeams'])
    .then(() => {
      cy.populateWorkPackageDetails(name, description, baseline, owner);
    })
    .then(() => {
      cy.get(`[data-qa=work-packages-modal-save]`)
        .click()
        .wait(['@POSTWorkPackage', '@GETWorkPackage', '@GETWorkPackagePaging'], {
          requestTimeout: 20000,
          responseTimeout: 40000
        });
      cy.get('[data-qa=details-spinner]').should('not.be.visible');
    });
});

Cypress.Commands.add('populateWorkPackageDetails', (name, description, baseline, owner) => {
  if (owner.length > 0) {
    cy.selectDropDown('work-packages-details-owners-selection', owner);
  }
  cy.get('smi-workpackage-modal').within(() => {
    cy.get(`[data-qa=work-packages-details-name]`)
      .paste(name)
      .should('have.value', name)
      .get(`[data-qa=work-packages-details-description]`)
      .paste(description)
      .should('have.value', description);
  });
});

Cypress.Commands.add(
  'paste',
  {
    prevSubject: true,
    element: true
  },
  ($element, text) => {
    const subString = text.substr(0, text.length - 1);
    const lastChar = text.slice(-1);

    $element.text(subString);
    $element.val(subString);
    cy.get($element).type(lastChar);
  }
);

/*Cypress.Commands.overwrite('type', (originalFn, subject, string, options) =>
  originalFn(subject, string, Object.assign({}, { delay: 100 }, options))
);*/

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
