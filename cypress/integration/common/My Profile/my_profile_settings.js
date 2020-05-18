//This file is used to parameterise the tabs in use across the application.  This is to get around the issues that angular tabs cannot have data hooks
let api_version = '/api/v0.2';
module.exports = {
  menu_selector: 'main-menu-my-profile',
  page_check: 'my-user',
  wait_for: {
    Roles: {
      api: `${api_version}/roles`,
      method: 'GET',
      name: 'Roles'
    },
    MyProfile: {
      api: `${api_version}/navigate/myprofile`,
      method: 'GET',
      name: 'MyProfile'
    },
    GetTeams: {
      api: `${api_version}/teams`,
      method: 'GET',
      name: 'Teams'
    }
  }
};
