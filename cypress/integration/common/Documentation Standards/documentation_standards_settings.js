//This file is used to parameterise the tabs in use across the application.  This is to get around the issues that angular tabs cannot have data hooks
let api_version = '/api/v0.2';
module.exports = {
  menu_selector: 'main-menu-documentation-standards',
  page_check: 'documentation-standards',
  wait_for: {
    CustomProperties: {
      api: `${api_version}/customProperties*`,
      method: 'POST',
      name: 'CustomProperties'
    },
    CustomProperties1: {
      api: `${api_version}/customProperties*`,
      method: 'GET',
      name: 'CustomProperties'
    },
    CustomProperties2: {
      api: `${api_version}/customProperties/*`,
      method: 'DELETE',
      name: 'CustomProperties'
    },
    CustomPropertiess: {
      api: `${api_version}/customProperties/*`,
      method: 'GET',
      name: 'CustomProperties*'
    }
  }
};
