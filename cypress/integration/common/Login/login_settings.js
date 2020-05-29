//This file is used to parameterise the tabs in use across the application.  This is to get around the issues that angular tabs cannot have data hooks
let api_version = '/api/v0.2';
module.exports = {
  menu_selector: 'main-menu-log-out',
  page_check: 'login',
  wait_for: {
    GetTeams: {
      api: `${api_version}/navigate/myworkpackages`,
      method: 'GET',
      name: 'navigateMyWorkPackages'
    },
    GetUsers: {
      api: `${api_version}/navigate/myradios`,
      method: 'GET',
      name: 'navigateMyRadios'
    },
    GetRoles: {
      api: `${api_version}/navigate/mylayouts`,
      method: 'GET',
      name: 'navigateMyLayouts'
    },
    login: {
      api: `${api_version}/users/login`,
      method: 'POST',
      name: 'login'
    },
    GetNotfications: {
      api: `${api_version}/notifications`,
      method: 'GET',
      name: 'Notifications',
      stub: []
    }
  }
};
