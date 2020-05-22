//This file is used to parameterise the tabs in use across the application.  This is to get around the issues that angular tabs cannot have data hooks
let api_version = '/api/v0.2';
module.exports = {
  menu_selector: 'main-menu-radios',
  page_check: 'radio',
  wait_for: {
    GetWorkPackage: {
      api: `${api_version}/users`,
      method: 'GET',
      name: 'Users'
    },
    GetArchiveWorkPackages: {
      api: `${api_version}/radios`,
      method: 'GET',
      name: 'Radios'
    },
    PostWorkPackage: {
      api: `${api_version}/nodes`,
      method: 'GET',
      name: 'Nodes'
    },
    PostRadioWorkPackage: {
      api: `${api_version}/workpackages/*/radios/*`,
      method: 'POST',
      name: ' RadioWorkPackage'
    },
    PostRadios: {
      api: `${api_version}/radios`,
      method: 'POST',
      name: 'Radios'
    },
    GetRadios: {
      api: `${api_version}/radios`,
      method: 'GET',
      name: 'Radios'
    },
    GetRadio: {
      api: `${api_version}/radios/*`,
      method: 'GET',
      name: 'Radio'
    }
  }
};
