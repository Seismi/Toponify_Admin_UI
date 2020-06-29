//This file is used to parameterise the tabs in use across the application.  This is to get around the issues that angular tabs cannot have data hooks
let api_version = '/api/v0.2';
module.exports = {
  tabs: {
    Details: 1,
    'Attributes and Rules': 2,
    'Documentation Standards': 3,
    Radio: 4,
    Changes: 5
  },
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
    },
    ReportsFilterQuery: {
      api: `${api_version}/reports*`,
      method: 'GET',
      name: 'ReportsFilterQuery'
    },
    ReportsQuery: {
      api: `${api_version}/reports/*`,
      method: 'GET',
      name: 'ReportsQuery'
    },
    WorkPackagesReports: {
      api: `${api_version}/workpackages/*/reports`,
      method: 'POST',
      name: 'WorkPackageReports'
    },
    GetNodes: {
      api: `${api_version}/nodes`,
      method: 'GET',
      name: 'Nodes'
    },
    GetWorkPackageReports: {
      api: `${api_version}/workpackages/*/reports/*`,
      method: 'PUT',
      name: 'WorkPackageReports'
    },
    GetWorkPackageReportsTags: {
      api: `${api_version}/workpackages/*/reports/*/tags`,
      method: 'GET',
      name: 'WorkPackageReportsTags'
    },
    PUTWorkPackageDeleteRequest: {
      api: `${api_version}/workpackages/*/reports/*/deleteRequest`,
      method: 'POST',
      name: 'WorkPackageDeleteRequest'
    },
    PUTWorkPackagesReportsCustomPropertyValues: {
      api: `${api_version}/workpackages/*/reports/*/customPropertyValues/*`,
      method: 'PUT',
      name: 'WorkPackagesReportsCustomPropertyValues'
    }
  }
};
