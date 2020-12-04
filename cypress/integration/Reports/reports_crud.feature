@core
Feature: Create new report
  As a user, I want to be able to create new reports within a work package

  Background:
    Given a valid user is logged in
    And the user selects Work Package menu item
    And the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the user selects Topology menu item
    # And the "System View" layer is selected
    And the work package 'Created Automated Regression Test Work Package' is editable on the 'work packages' menu
    And the "Topology" "Systems" Tab is selected
    And the user creates a new 'transactional' system with name 'Automated Regression Test Transactional System'
    And the user creates a new 'reporting' system with name 'Automated Regression Test Reporting System'
    And the user selects Reports menu item

  @reports
  Scenario: Create Report and then cancel
    When the user creates a new report with the name 'Created Automated Regression Test Report', description 'Automated Regression Test Report description' and selects system 'Automated Regression Test Transactional System'
    And the user cancels the creation of the report
    Then the new report 'Created Automated Regression Test Report' should not exist in the reports table
    When the user reloads the Reports page
    Then the new report 'Created Automated Regression Test Report' should not exist in the reports table

  @reports
  Scenario: Create Report and then confirm
    When the user creates a new report with the name 'Created Automated Regression Test Report', description 'Automated Regression Test Report description' and selects system 'Automated Regression Test Transactional System'
    And the user confirms the creation of the report
    Then the new report 'Created Automated Regression Test Report' should exist in the reports table
    And the user selects the report 'Created Automated Regression Test Report' in the reports table
    And the details pane should reflect the name 'Created Automated Regression Test Report', description 'Automated Regression Test Report description' and and the system 'Automated Regression Test Transactional System'
    When the user reloads the Reports page
    Then the new report 'Created Automated Regression Test Report' should exist in the reports table
    And the details pane should reflect the name 'Created Automated Regression Test Report', description 'Automated Regression Test Report description' and and the system 'Automated Regression Test Transactional System'

  @reports
  Scenario: Update report and then cancel
    Given the user creates a new report with the name 'Created Automated Regression Test Report', description 'Automated Regression Test Report description' and selects system 'Automated Regression Test Transactional System'
    And the user confirms the creation of the report
    And the user selects the report 'Created Automated Regression Test Report' in the reports table
    When the user updates the name to 'Automated Updated Regression Test Report', the description to 'Automated Updated Regression Test Report Description'
    And the user cancels the update of the report name and description
    And the user updates the source system to 'Automated Regression Test Reporting System'
    And the user cancels the update of source system
    Then the new report 'Created Automated Regression Test Report' should exist in the reports table
    Then the details pane should reflect the name 'Created Automated Regression Test Report', description 'Automated Regression Test Report description' and and the system 'Automated Regression Test Transactional System'

  @reports
    Scenario: Update report and then confirm
    Given the user creates a new report with the name 'Created Automated Regression Test Report', description 'Automated Regression Test Report description' and selects system 'Automated Regression Test Transactional System'
    And the user confirms the creation of the report
    And the user selects the report 'Created Automated Regression Test Report' in the reports table
    When the user updates the name to 'Automated Updated Regression Test Report', the description to 'Automated Updated Regression Test Report Description'
    And the user confirms the update of the report name and description
    And the user updates the source system to 'Automated Regression Test Reporting System'
    And the user confirms the update of source system
    Then the details pane should reflect the name 'Automated Updated Regression Test Report', description 'Automated Updated Regression Test Report Description' and and the system 'Automated Regression Test Reporting System'
    When the user reloads the Reports page
    Then the new report 'Automated Updated Regression Test Report' should exist in the reports table
    And the details pane should reflect the name 'Automated Updated Regression Test Report', description 'Automated Updated Regression Test Report Description' and and the system 'Automated Regression Test Reporting System'

  @reports
  Scenario: Delete report and then cancel
    Given the user creates a new report with the name 'Created Automated Regression Test Report', description 'Automated Regression Test Report description' and selects system 'Automated Regression Test Transactional System'
    And the user confirms the creation of the report
    And the user selects the report 'Created Automated Regression Test Report' in the reports table
    When the user deletes the report
    And the user cancels the delete of the report
    Then the new report 'Created Automated Regression Test Report' should exist in the reports table
    When the user reloads the Reports page
    Then the new report 'Created Automated Regression Test Report' should exist in the reports table

  @reports
  Scenario: Delete report and then confirm
    Given the user creates a new report with the name 'Created Automated Regression Test Report', description 'Automated Regression Test Report description' and selects system 'Automated Regression Test Transactional System'
    And the user confirms the creation of the report
    And the user selects the report 'Created Automated Regression Test Report' in the reports table
    And the user deletes the report
    And the user confirms the delete of the report
    Then the new report 'Created Automated Regression Test Report' should not exist in the reports table
    When the user reloads the Reports page
    Then the new report 'Created Automated Regression Test Report' should not exist in the reports table

  #https://toponify.atlassian.net/browse/TOP-944
  @reports @known_failure
  Scenario: Create a new report then switch to current architecture and test if still visible
    When the user creates a new report with the name 'Created Automated Regression Test Report', description 'Automated Regression Test Report description' and selects system 'Automated Regression Test Transactional System'
    And the user confirms the creation of the report
    Then the new report 'Created Automated Regression Test Report' should exist in the reports table
    And the work package 'Created Automated Regression Test Work Package' is 'not displayed' on the 'reports' menu
    Then the new report 'Created Automated Regression Test Report' should not exist in the reports table
