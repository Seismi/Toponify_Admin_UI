//This file is used to parameterise the tabs in use across the application.  This is to get around the issues that angular tabs cannot have data hooks
let api_version = '/api/v0.2';
module.exports = {
  menu_selector: 'main-menu-reports',
  page_check: 'report-library',
  wait_for: {
    GetScopes: {
      api: `${api_version}/scopes`,
      method: 'GET',
      name: 'Scopes'
    },
    GetScope: {
      api: `${api_version}/scopes/*`,
      method: 'GET',
      name: 'Scope'
    },
    GetWorkPackage: {
      api: `${api_version}/workpackages`,
      method: 'GET',
      name: 'WorkPackages'
    },
    GetLayout: {
      api: `${api_version}/layouts/*`,
      method: 'GET',
      name: 'Layout'
    }
  }
};
