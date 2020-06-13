//This file is used to parameterise the tabs in use across the application.  This is to get around the issues that angular tabs cannot have data hooks
let api_version = '/api/v0.2';
module.exports = {
  tabs: {
    Details: 1,
    'Documentation Standards': 2,
    Objectives: 3,
    Radio: 4,
    Changes: 5
  },
  menu_selector: 'main-menu-work-packages',
  page_check: 'work-packages',
  wait_for: {
    GetWorkPackages: {
      api: `${api_version}/workpackages`,
      method: 'GET',
      name: 'WorkPackages'
    },
    GetWorkPackage: {
      api: `${api_version}/workpackages/*`,
      method: 'GET',
      name: 'WorkPackage'
    },
    PutWorkPackage: {
      api: `${api_version}/workpackages/*`,
      method: 'PUT',
      name: 'WorkPackage'
    },
    GetArchiveWorkPackages: {
      api: `${api_version}/workpackages?includeArchived=*`,
      //                        api: `${api_version}/workpackages*`,
      method: 'GET',
      name: 'ArchiveWorkPackages'
    },
    PostWorkPackage: {
      api: `${api_version}/workpackages`,
      method: 'POST',
      name: 'WorkPackage'
    },
    DeleteWorkPackage: {
      api: `${api_version}/workpackages/*`,
      method: 'DELETE',
      name: 'WorkPackage'
    },
    GetTeams: {
      api: `${api_version}/teams`,
      method: 'GET',
      name: 'Teams'
    },
    GetSelector: {
      api: `${api_version}/workpackages/selector/availability`,
      method: 'GET',
      name: 'SelectorAvailability'
    },
    CustomProperties4: {
      api: `${api_version}/workpackages/*/customPropertyValues/*`,
      method: 'PUT',
      name: 'customPropertyValues'
    },
    submitWorkPackage: {
      api: `${api_version}/workpackages/*/submit`,
      method: 'POST',
      name: 'submitWorkPackage'
    },
    resetWorkPackage: {
      api: `${api_version}/workpackages/*/reset`,
      method: 'POST',
      name: 'resetWorkPackage'
    },
    approveWorkPackage: {
      api: `${api_version}/workpackages/*/approve`,
      method: 'POST',
      name: 'approveWorkPackage'
    },
    supersedeWorkPackage: {
      api: `${api_version}/workpackages/*/supersede`,
      method: 'POST',
      name: 'supersedeWorkPackage'
    },
    archiveWorkPackage: {
      api: `${api_version}/workpackages/*/archive`,
      method: 'POST',
      name: 'archiveWorkPackage'
    },
    objectives: {
      api: `${api_version}/objectives`,
      method: 'POST',
      name: 'objectives'
    },
    workPackageObjectives: {
      api: `${api_version}/workpackages/*/objectives/*`,
      method: 'POST',
      name: 'workPackageObjectives'
    },
    workPackageObjectives1: {
      api: `${api_version}/workpackages/*/objectives/*`,
      method: 'DELETE',
      name: 'workPackageObjectives'
    },
    GetRadios: {
      api: `${api_version}/radios`,
      method: 'GET',
      name: 'Radios'
    },
    GetUsers: {
      api: `${api_version}/users`,
      method: 'GET',
      name: 'Users'
    },
    GetBaselineAvailability: {
      api: `${api_version}/workpackages/*/baseline/check/availability`,
      method: 'GET',
      name: 'WorkPackageAvailability'
    },
    PostWorkPackageBaseline: {
      api: `${api_version}/workpackages/*/baseline/*`,
      method: 'POST',
      name: 'WorkPackageBaseline'
    },
    DeleteWorkPackageBaseline: {
      api: `${api_version}/workpackages/*/baseline/*`,
      method: 'DELETE',
      name: 'WorkPackageBaseline'
    },
    PostRadios: {
      api: `${api_version}/radios`,
      method: 'POST',
      name: 'Radios'
    },
    PostRadioWorkPackage: {
      api: `${api_version}/workpackages/*/radios/*`,
      method: 'POST',
      name: 'RadioWorkPackage'
    },
    GetRadio: {
      api: `${api_version}/radios/*`,
      method: 'GET',
      name: 'Radio'
    },
    PostRadioReply: {
      api: `${api_version}/radios/*/reply`,
      method: 'POST',
      name: 'RadioReply'
    }
  }
};
