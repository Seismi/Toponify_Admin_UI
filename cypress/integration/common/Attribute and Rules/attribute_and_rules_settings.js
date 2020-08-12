//This file is used to parameterise the tabs in use across the application.  This is to get around the issues that angular tabs cannot have data hooks
let api_version = '/api/v0.2';
module.exports = {
  menu_selector: 'main-menu-attributes-and-rules',
  page_check: 'attributes-and-rules',
  wait_for: {
    GetAttributes: {
      api: `${api_version}/attributes?*`,
      method: 'GET',
      name: 'Attributes'
    },
    GetAttributeAndRule: {
      api: `${api_version}/attributes/*`,
      method: 'GET',
      name: 'AttributeAndRule'
    },
    GetWorkPackages: {
      api: `${api_version}/workpackages`,
      method: 'GET',
      name: 'WorkPackages'
    },
    GetLayout: {
      api: `${api_version}/layouts/*`,
      method: 'GET',
      name: 'Layout'
    },
    GetScopes: {
      api: `${api_version}/scopes`,
      method: 'GET',
      name: 'Scopes'
    },
    GetSelectorWorkPackage: {
      api: `${api_version}/workpackages/selector/availability*`,
      method: 'GET',
      name: 'SelectorAvailabilityQuery'
    },
    POSTWorkPackageAttributes: {
      api: `${api_version}/workpackages/*/attributes`,
      method: 'POST',
      name: 'WorkPackageAttributes'
    },
    PUTAttributeAndRule: {
      api: `${api_version}/workpackages/*/attributes/*`,
      method: 'PUT',
      name: 'AttributeAndRule'
    },
    GetAttributeTags: {
      api: `${api_version}/workpackages/*/attributes/*/tags`,
      method: 'GET',
      name: 'AttributeTags'
    },
    DeleteAttribute: {
      api: `${api_version}/workpackages/*/attributes/*/deleteRequest`,
      method: 'POST',
      name: 'DeleteAttribute'
    }
  }
};
