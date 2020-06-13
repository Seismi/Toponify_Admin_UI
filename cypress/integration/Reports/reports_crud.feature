Feature: Create new report
  As a user, I want to be able to create new reports within a work package

  Background:
    Given a valid user is logged in
    And the user selects Work Package menu item
    And the work package 'Automated Regression Test Work Package' does not exist
    And the user has created and selected a work package called 'Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the user selects Topology menu item
    And the "System View" layer is selected
    And the work package 'Automated Regression Test Work Package' is editable on the 'work packages' menu
    And the "Topology" "Systems" Tab is selected
    And the user creates a new 'transactional' system with name 'Automated Regression Test System'
    And the user selects Reports menu item

    #TODO - You need to create the system that is going to be used within the reports

  @focus
  Scenario: Create Report and then cancel
    #TODO - this and all subsequent tests should use the system that you created above
    When the user creates a new report with the name 'Automated Regression Test Report', description 'Automated Regression Test Report description' and selects system 'Automated Regression Test System'
    And the user cancels the creation of the report
    Then the new report 'Automated Regression Test Report' should not exist in the reports table

  @focus
  Scenario: Create Report and then confirm
    #TODO - this and all subsequent tests should use the system that you created above
    When the user creates a new report with the name 'Automated Regression Test Report', description 'Automated Regression Test Report description' and selects system 'Automated Regression Test System'
    And the user confirms the creation of the report
    Then the new report 'Automated Regression Test Report' should exist in the reports table

  Scenario: Complete creating a new report
  Given the report 'Automated Regression Testing Report' does exist with description 'Base' in the 'Automated Regression Test Work Package'
   When clicks on create a new report
    And sets a new report with the name 'Automated Regression Test Report', description 'Automated Regression Test Report description' and selects system 'ERP'
    And user 'confirms' the creation of the report
   Then the report 'Automated Regression Test Report' should be created
    #TODO -- Is there a second check required against the ERP system
    #TODO -- Need to check immediately and after reload

  Scenario: Cancel updating a report
  Given the report 'Automated Regression Testing Report' does exist with description 'Base' in the 'Automated Regression Test Work Package'
   When finds the 'Automated Regression Testing Report'
    And edits the description to 'Automated testing description change'
    And cancels the change
   Then the description of the report 'Automated Regression Test Report' in the details pane is reverts to 'Base'

  Scenario: Update a report
  Given the report 'Automated Regression Testing Report' does exist with description 'Base' in the 'Automated Regression Test Work Package'
   When finds the 'Automated Regression Testing Report'
    And edits the description to 'Automated testing description change'
    And confirms the update of the report 'Automated Regression Testing Report'
    Then the description of the report 'Automated Regression Test Report' in the report table is updated to 'Automated testing description change'
    #TODO -- Is there a second check required against the ERP system
    #TODO -- Need to check immediately and after reload

  Scenario: Create a new report then switch to current architecture
    Given the report 'Automated Regression Testing Report' does exist with description 'Base' in the 'Automated Regression Test Work Package'
   When clicks on the Create New button in the Reports table
    And sets a new report with the name 'Automated Regression Test Report', description 'Automated Regression Test Report description' and selects system 'ERP'
    And user saves the report
    And user de-selects the Display option of the 'Automated Regression Test Work Package'
    Then the report 'Automated Regression Test Report 2' cannot be found in the report table

  # TODO - is this testing the delete of a work package or a report?
  Scenario: Delete a report and cancel
    Given the report 'Automated Regression Testing Report' does exist with description 'Base' in the 'Automated Regression Test Work Package'
   When deletes the 'Automated Regression Testing Report'
    And confirms deletion
    Then the report 'Automated Regression Test Report' can be found in the report table

  # TODO - is this testing the delete of a work package or a report?
  Scenario: Delete a work package and confirm
   When deletes the 'Automated Regression Testing Report'
    And cancels deletion
    Then the report 'Automated Regression Test Report' cannot be found in the report table
