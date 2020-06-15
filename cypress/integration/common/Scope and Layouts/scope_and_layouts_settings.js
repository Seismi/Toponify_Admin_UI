//This file is used to parameterise the tabs in use across the application.  This is to get around the issues that angular tabs cannot have data hooks
let api_version = '/api/v0.2';
module.exports = {
  menu_selector: 'main-menu-scopes-and-layouts',
  page_check: 'scopes-and-layout',
  wait_for: {
    GetWorkPackage: {
      api: `${api_version}/scopes`,
      method: 'GET',
      name: 'Scopes'
    },
    PostLayouts: {
      api: `${api_version}/layouts`,
      method: 'POST',
      name: 'Layouts'
    },
    PutLayoutScope: {
      api: `${api_version}/scopes/*`,
      method: 'PUT',
      name: 'LayoutScope'
    },
    DeleteScope: {
      api: `${api_version}/scopes/*`,
      method: 'DELETE',
      name: 'Scopes'
    },
    PostScope: {
      api: `${api_version}/scopes`,
      method: 'POST',
      name: 'Scopes'
    },
    DeleteLayout: {
      api: `${api_version}/layouts/*`,
      method: 'DELETE',
      name: 'Layout'
    },
    GetScope: {
      api: `${api_version}/scopes/*`,
      method: 'GET',
      name: 'Scope'
    },
    GetLayout: {
      api: `${api_version}/layouts/*`,
      method: 'GET',
      name: 'Layout'
    },
    ScopesNodes: {
      api: `${api_version}/scopes/*/nodes`,
      method: 'POST',
      name: 'ScopesNodes'
    }
  }
};
