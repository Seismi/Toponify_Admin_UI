//This file is used to parameterise the tabs in use across the application.  This is to get around the issues that angular tabs cannot have data hooks
let api_version = '/api/v0.2';
module.exports = {
  tabs: {
    'My User': 1,
    Teams: 2,
    'All Users': 3,
    Organisation: 4
  },
  menu_selector: 'main-menu-settings',
  page_check: 'settings',
  wait_for: {
    GetTeams: {
      api: `${api_version}/teams`,
      method: 'GET',
      name: 'Teams'
    },
    GetTeam: {
      api: `${api_version}/teams/*`,
      method: 'GET',
      name: 'Team'
    },
    PutTeam: {
      api: `${api_version}/teams/*`,
      method: 'PUT',
      name: 'Team'
    },

    PostTeams: {
      api: `${api_version}/teams`,
      method: 'POST',
      name: 'Teams'
    },
    GetUsers: {
      api: `${api_version}/users`,
      method: 'GET',
      name: 'Users'
    },
    GetRoles: {
      api: `${api_version}/roles`,
      method: 'GET',
      name: 'Roles'
    },
    navigateMyProfile: {
      api: `${api_version}/navigate/myprofile`,
      method: 'GET',
      name: 'navigateMyProfile'
    },
    GetUser: {
      api: `${api_version}/users/*`,
      method: 'GET',
      name: 'User'
    },
    PutUser: {
      api: `${api_version}/users/*`,
      method: 'PUT',
      name: 'User'
    },
    PostUser: {
      api: `${api_version}/user/*`,
      method: 'POST',
      name: 'User'
    },
    myProfile: {
      api: `${api_version}/navigate/myprofile`,
      method: 'GET',
      name: 'myProfile'
    }
  }
};
