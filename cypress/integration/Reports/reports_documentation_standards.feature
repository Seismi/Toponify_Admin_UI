@core
Feature: Report Edit Documentation Standards Feature
  As a user, I want to be able to add documentation standards to reports

# NUMBER TESTS
  Background:
    Given a valid user is logged in
    And the user selects Work Package menu item
    And the work package 'Created Automated Regression Test Work Package' does not exist
    And the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the user selects Documentation Standard menu item
    And the documentation standard 'Regression Test Documentation Standard URL' does not exist
    And the documentation standard 'Regression Test Documentation Standard URL' exists with type 'Hyperlink' against 'Reports' component
    And the user confirms the creation of the documentation standard
    And the user selects Topology menu item
    # And the "System View" layer is selected
    And the work package 'Created Automated Regression Test Work Package' is editable on the 'work packages' menu
    And the "Topology" "Systems" Tab is selected
    And the user creates a new 'transactional' system with name 'Automated Regression Test Transactional System'
    And the user creates a new 'reporting' system with name 'Automated Regression Test Reporting System'
    And the user selects Reports menu item
    And the user creates a new report with the name 'Automated Regression Test Report', description 'Automated Regression Test Report description' and selects system 'Automated Regression Test Transactional System'
    And the user confirms the creation of the report
    And the new report 'Automated Regression Test Report' should exist in the reports table
    And the user selects the report 'Automated Regression Test Report' in the reports table

  @documentation_standards @reports
  Scenario: Create each type of documentation standard against a report and check that valid and invalid data can be entered and the controls act as expected
    When the 'Reports' 'Documentation Standards' pane is open
    And the user enters string 'this is some text' into field 'Regression Test Documentation Standard URL'
    And the user clicks to 'save' the invalid change
    Then the 'Regression Test Documentation Standard URL' should display the error message 'Not valid! Please make sure that your value matches property type'
    When the user clicks to 'cancel' the invalid change
    And  the user enters string 'https://www.seismi.net' into field 'Regression Test Documentation Standard URL'
    And the user clicks to 'save' the valid change
    Then the value of 'Regression Test Documentation Standard URL' should be 'https://www.seismi.net'
    When the user selects Documentation Standard menu item
    And the user deletes the documentation standard 'Regression Test Documentation Standard URL'
    And the user 'confirms' the deletion of the documentation standard
    Then the document standard 'Regression Test Documentation Standard URL' should not exist in the documentation standards table
    When the user selects Reports menu item
    And the work package 'Created Automated Regression Test Work Package' is editable on the 'reports' menu
    And the user selects the report 'Automated Regression Test Report' in the reports table
    And the 'Reports' 'Documentation Standards' pane is open
    And the documentation standard 'Regression Test Documentation Standard URL' should not be visible
