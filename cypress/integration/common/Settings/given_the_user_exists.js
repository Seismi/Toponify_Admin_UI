const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps');
let team, role;

Given(
  'the user with email address {string} exists with first name {string}, last name {string}, phone number {string}, team {string} and role {string}',
  function(email, first, last, phone, teams, roles) {
    cy.get('[data-qa=settings-all-users-quick-search]') // get the all users search
      .clear() //clear contents
      .paste(email)
      .should('have.value', email)
      .then(() => {
        //type email address
        cy.get(`[data-qa=all-users-table]`)
          .find('table>tbody')
          .then($table => {
            // get the table
            if ($table[0].rows.length === 0) {
              //if the user does not exist
              createUser(
                'settings-all-users-create-new',
                'settings-all-users-modal-save',
                'create',
                email,
                first,
                last,
                phone,
                team,
                role
              ); // create the user
            } else {
              // if the user does exist
              cy.get(`[data-qa=all-users-table]`)
                .find('table>tbody>tr :first')
                .click()
                .then(() => {
                  // get and click on the correct row in the table
                  cy.wait(['@GETRoles', '@GETUser']); // wait for the roles and user api calls to complete
                  updateUser(
                    'settings-user-edit',
                    'settings-user-save',
                    'update',
                    email,
                    first,
                    last,
                    phone,
                    team,
                    role
                  ); //udpate the user
                });
            }
          });
      });
  }
);

When(
  'the user with email address {string} is updated with first name {string}, last name {string}, phone number {string}, team {string} and role {string}',
  function(email, first, last, phone, teams, roles) {
    cy.selectUser(email)
      .click()
      .then(() => {
        // select the user
        updateUser('settings-user-edit', 'settings-user-save', 'update', email, first, last, phone, team, role); // update the user
      });
  }
);

When(
  'my user is updated with first name {string}, last name {string}, phone number {string}, team {string} and role {string}',
  function(first, last, phone, teams, roles) {
    updateUser('settings-user-edit', 'settings-user-save', 'update', '', first, last, phone, team, role); //update the user
  }
);

Then(
  'my user should have first name {string}, last name {string}, phone number {string}, team {string} and role {string}',
  function(first, last, phone, team, role) {
    cy.reload() //reload page to force APIs to run and check database write
      .wait(['@GETRoles', '@GETTeams', '@GETmyProfile']) //wait for relevant routes
      .then(() => {
        cy.get('[data-qa=settings-my-user-my-user-form]') //get the modal form
          .within(() => {
            assertForm(first, last, phone, team, role); //assert that the form has the correct details
          });
      });
  }
);

Then(
  'the user with email address {string} should have first name {string}, last name {string}, phone number {string}, team {string} and role {string}',
  function(email, first, last, phone, team, role) {
    cy.reload() //reload page to force APIs to run and check database write
      .wait(['@GETRoles', '@GETTeams', '@GETUsers', '@GETUser']) //wait for relevant routes
      .then(() => {
        cy.selectUser(email) //select the relevant user
          .click()
          .then(() => {
            cy.get('[data-qa=settings-all-users-my-user-form]').within(() => {
              assertForm(first, last, phone, team, role); //assert that the form has the correct details
            });
          });
      });
  }
);

/*****************************************************************************************************************************************/
/* SUPPORTING CODE                                                                                                                       */
/*****************************************************************************************************************************************/

function createUser(editButton, saveButton, action, email, first, last, phone, team, role) {
  // Creates a users if it doesn't exist
  cy.get(`[data-qa=${editButton}]`)
    .click({ force: true })
    .wait('@GETRoles')
    .then(() => {
      // get the edit button and wait for the roles api
      cy.get('[data-qa=settings-all-users-modal-form]').within(() => {
        // constrain commands to the modal form
        cy.get(`[data-qa=settings-user-email]`)
          .clear()
          .paste(email)
          .should('have.value', email); // clear and type email
        cy.get(`[data-qa=settings-user-first-name]`)
          .clear()
          .paste(first)
          .should('have.value', first); // clear and type first name
        cy.get(`[data-qa=settings-user-last-name]`)
          .clear()
          .paste(last)
          .should('have.value', last); // clear and type last name
        cy.get(`[data-qa=settings-user-phone-number]`)
          .clear()
          .paste(phone)
          .should('have.value', phone); // clear and type phone number
      });
      team.forEach(t => {
        // fpr each team
        selectDropDown('settings-user-teams', t); //add to team drop down. This is outside the within statement as it appears elsewhere in html
      });
      role.forEach(t => {
        selectDropDown('settings-user-roles', role); //add to settings drop down. This is outside the within statement as it appears elsewhere in html
      });
    })
    .then(() => {
      cy.get(`[data-qa=${saveButton}]`)
        .click()
        .then(() => {
          // click the save button
          cy.wait('@POSTUser'); // wait for the user api
        });
    });
}

function updateUser(editButton, saveButton, action, email, first, last, phone, teams, roles) {
  // updates a users if it does exist
  cy.get(`[data-qa=${editButton}]`) // click the edit button
    .click({ force: true })
    .then(() => {
      cy.get(`[data-qa=settings-user-first-name]`)
        .clear()
        .paste(first)
        .should('have.value', first); // clear and type the first name
      cy.get(`[data-qa=settings-user-last-name]`)
        .clear()
        .paste(last)
        .should('have.value', last); // clear and type the last name
      cy.get(`[data-qa=settings-user-phone-number]`)
        .clear()
        .paste(phone)
        .should('have.value', phone); // clear and type the phone number
      resetDropDown('settings-user-teams'); //reset the drop down to have remove all currently selected teams
      teams.forEach(team => {
        // for each team in the feature file
        selectDropDownCheckBox('settings-user-teams', team); // select the team
      });
      resetDropDown('settings-user-roles'); //reset the drop down to have remove all currently selected roles
      roles.forEach(role => {
        //for each role in the feature file
        selectDropDownCheckBox('settings-user-roles', role); // select the role
      });
    })
    .then(() => {
      cy.get(`[data-qa=${saveButton}]`)
        .click()
        .then(() => {
          //get the save button
          cy.wait('@PUTUser'); // wait for the put user API
        });
    });
}

function resetDropDown(dropdown) {
  // identifies and removes all currently selected items in a drop down
  cy.root() // from the root element
    //.find('mat-option>span')
    .get(`[data-qa=${dropdown}]`) //get the drop down
    .find('div .mat-select-value>span>span') // get the selected value as a string
    .then(val => {
      let settings = val[0].textContent.split(',').map(setting => {
        // split, trim and return the selected values
        return setting.trim();
      });
      cy.get(`[data-qa=${dropdown}`)
        .click() // click the drop down to open
        .then(() => {
          //Turn off all currently selected teams
          settings.forEach(setting => {
            // for each of the settings
            cy.root() //from root
              .find('mat-option') //find the mat-options
              .contains(setting) // that contain the setting
              .click({ force: true }); // and click (i.e turn off)
          });
          cy.get(`[data-qa=${dropdown}`).type('{esc}'); //escape the drop down
        });
    });
}

function selectDropDownCheckBox(dropdown, value) {
  // selects a value in a drop down check box
  cy.get(`[data-qa=${dropdown}`)
    .click() // open the drop down
    .then(() => {
      cy.root() // go to root
        .find('mat-option') // find the op
        .contains(value)
        .click({ force: true })
        .then(() => {
          cy.get(`[data-qa=${dropdown}]`).type('{esc}'); // escape the drop down
        });
    });
}

function selectDropDown(dropDown, value) {
  // selects a value in a drop down
  cy.get('[data-qa=settings-all-users-modal-form]') //in the modal form
    .find(`[data-qa=${dropDown}]`) // find the drop down
    .click() // click
    .then(() => {
      cy.get('.mat-option>span') //get the mat options
        .contains(value) // which contains the value
        .click({ force: true }) // and click
        .then(() => {
          cy.get('[data-qa=settings-all-users-modal-form]')
            .find(`[data-qa=${dropDown}]`)
            .type('{esc}'); //escape the drop down
        });
    });
}

function assertForm(first, last, phone, team, role) {
  // Asserts the value of the form are as expected
  cy.get(`[data-qa=settings-user-first-name]`).then(input => {
    expect(input[0].value).to.equal(first);
  });
  cy.get(`[data-qa=settings-user-last-name]`).then(input => {
    expect(input[0].value).to.equal(last);
  });
  cy.get(`[data-qa=settings-user-phone-number]`).then(input => {
    expect(input[0].value).to.equal(phone);
  });
  cy.get(`[data-qa=settings-user-teams]`).then(input => {
    expect(input[0].textContent).to.equal(team);
  });
  cy.get(`[data-qa=settings-user-roles]`).then(input => {
    expect(input[0].textContent).to.equal(role);
  });
}
