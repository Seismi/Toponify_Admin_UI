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

/*
const attributeAndRules = require("../integration/common/Attribute and Rules/attribute_and_rules_settings")
const documentationStandards = require("../integration/common/Documentation Standards/documentation_standards_settings")
const logout = require("../integration/common/Logout/logout_settings")
const myProfile = require("../integration/common/My Profile/my_profile_settings")
const radios = require("../integration/common/Radios/radios_settings")
const reports = require("../integration/common/Reports/reports_settings")
const scopesAndLayouts = require("../integration/common/Scope and Layouts/scope_and_layouts_settings")
const topology = require("../integration/common/Topology/topology_settings")
const settings = require("../integration/common/Settings/settings_settings")
const home = require("../integration/common/Home/home_settings")

const pages = {
        'Home':home,
        'Topology': topology,
        'Reports': reports,
        'Attributes and Rules': attributeAndRules,
        'Work Package': workPackage,
        'Radios': radios,
        'Scopes and Layouts': scopesAndLayouts,
        'Documentation Standard': documentationStandards,
        'My Profile': myProfile,
        'Settings': settings,
        'Logout': logout,
        'Login': login
}*/

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
              cy.wait(['@GETnavigateMyWorkPackages', '@GETnavigateMyRadios', '@GETnavigateMyLayouts']);
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
    .click();
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

Cypress.Commands.add('findWorkPackage', name => {
  cy.get('[data-qa=work-packages-archive-toggle]') // get the archive toggle
    .find('label>div>input')
    .uncheck({ force: true })
    .check({ force: true })
    .wait('@GETArchiveWorkPackages') // wait for the return of the archive work packages
    .then(() => {
      cy.get(`[data-qa=work-packages-quick-search]`) // get the quick packages search
        .clear() //clear the box
        .type(name) // type the name
        .then(() => {
          return cy
            .get(`[data-qa=work-packages-table]`) // get the work packages table
            .find('table>tbody'); // find the table
        });
    });
});

Cypress.Commands.add('findScope', name => {
  cy.get(`[data-qa=scopes-and-layouts-scope-table]`)
    .find(`[data-qa=scopes-and-layouts-quick-search]`) // get the quick packages search
    .clear() //clear the box
    .type(name) // type the name
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
    .then(() => {
      cy.get(`[data-qa=${table}]`).find('table>tbody>tr :first');
    });
});

Cypress.Commands.add('findWorkPackageRadio', name => {
  cy.get(`[data-qa=work-packages-radio-table-quick-search]`) // get the quick packages search
    .clear() //clear the box
    .type(name); //type the name
  return cy
    .get(`[data-qa=work-packages-radio-table]`) // get the work packages table
    .find('table>tbody'); // find the table
});

Cypress.Commands.add('selectUser', email => {
  cy.get('[data-qa=settings-all-users-quick-search]')
    .clear()
    .type(email)
    .then(() => {
      cy.get(`[data-qa=all-users-table]`).find('table>tbody>tr :first');
    });
});

Cypress.Commands.add('selectTeam', team => {
  cy.get('[data-qa=settings-teams-quick-search]')
    .clear()
    .type(team)
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
      console.log(route);
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
        .then(() => {
          cy.get('table>tbody')
            .find('tr:first>td>div>div>mat-icon')
            .then(wp => {
              console.log(wp[0].textContent);
              if (wp[0].textContent === 'edit') {
                cy.get('table>tbody')
                  .find('tr:first>td>div>div>mat-icon')
                  .click()
                  .wait([
                    '@GETNodesWorkPackageQuery',
                    '@GETNodeLinksWorkPackageQuery',
                    '@GETSelectorAvailabilityQuery'
                  ]);
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
    .type(component);
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
