const { When } = require('cypress-cucumber-preprocessor/steps');

const login = require('../common/Login/login_settings');
const attributeAndRules = require('../common/Attribute and Rules/attribute_and_rules_settings');
const documentationStandards = require('../common/Documentation Standards/documentation_standards_settings');
const logout = require('../common/Logout/logout_settings');
const myProfile = require('../common/My Profile/my_profile_settings');
const radios = require('../common/Radios/radios_settings');
const reports = require('../common/Reports/reports_settings');
const scopesAndLayouts = require('../common/Scope and Layouts/scope_and_layouts_settings');
const topology = require('../common/Topology/topology_settings');
const workPackage = require('../common/Work Package/work_package_settings');
const settings = require('../common/Settings/settings_settings');
const home = require('../common/Home/home_settings');

const pages = {
  Home: home,
  Topology: topology,
  Reports: reports,
  'Attributes and Rules': attributeAndRules,
  'Work Package': workPackage,
  Radios: radios,
  'Scopes and Layouts': scopesAndLayouts,
  'Documentation Standard': documentationStandards,
  'My Profile': myProfile,
  Settings: settings,
  Logout: logout,
  Login: login
};

When('the {string} {string} pane is open', function(screen, tab) {
  //TODO need to change class tag below to use data-qa when available
  let posinset = pages[screen]['tabs'][tab];
  cy.selectDetailsPaneTab(posinset);
});
