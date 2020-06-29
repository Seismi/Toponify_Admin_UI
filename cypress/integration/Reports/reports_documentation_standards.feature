@core
Feature: Work Package Edit Documentation Standards Feature
  As a user, I want to be able to add documentation standards to reports

# NUMBER TESTS
  @documentation_standards @reports
  Scenario: Create each type of documentation standard against a report and check that valid and invalid data can be entered and the controls act as expected
    Given a valid user is logged in
    And the user selects Work Package menu item
    And the work package 'Automated Regression Test Work Package' does not exist
    And the user has created and selected a work package called 'Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the user selects Documentation Standard menu item
    And the documentation standard 'Regression Test Documentation Standard Number' does not exist
    And the documentation standard 'Regression Test Documentation Standard Number' exists with type 'Number' against 'Reports' component
    And the user confirms the creation of the documentation standard
    And the documentation standard 'Regression Test Documentation Standard Date' does not exist
    And the documentation standard 'Regression Test Documentation Standard Date' exists with type 'Date' against 'Reports' component
    And the user confirms the creation of the documentation standard
    And the documentation standard 'Regression Test Documentation Standard URL' does not exist
    And the documentation standard 'Regression Test Documentation Standard URL' exists with type 'Hyperlink' against 'Reports' component
    And the user confirms the creation of the documentation standard
    And the documentation standard 'Regression Test Documentation Standard Boolean' does not exist
    And the documentation standard 'Regression Test Documentation Standard Boolean' exists with type 'Boolean' against 'Reports' component
    And the user confirms the creation of the documentation standard
    And the documentation standard 'Regression Test Documentation Standard String' does not exist
    And the documentation standard 'Regression Test Documentation Standard String' exists with type 'Text' against 'Reports' component
    And the user confirms the creation of the documentation standard
    And the user selects Topology menu item
    And the "System View" layer is selected
    And the work package 'Automated Regression Test Work Package' is editable on the 'work packages' menu
    And the "Topology" "Systems" Tab is selected
    And the user creates a new 'transactional' system with name 'Automated Regression Test Transactional System'
    And the user creates a new 'reporting' system with name 'Automated Regression Test Reporting System'
    And the user selects Reports menu item
    When the user creates a new report with the name 'Automated Regression Test Report', description 'Automated Regression Test Report description' and selects system 'Automated Regression Test Transactional System'
    And the user confirms the creation of the report
    Then the new report 'Automated Regression Test Report' should exist in the reports table
    When the user selects the report 'Automated Regression Test Report' in the reports table
    And the 'Reports' 'Documentation Standards' pane is open
    When the user enters string 'this is some text' into field 'Regression Test Documentation Standard Number'
    And the user clicks to 'save' the invalid change
    Then the 'Regression Test Documentation Standard Number' should display the error message 'Not valid! Please make sure that your value matches property type'
    When the user clicks to 'cancel' the invalid change
    And the user enters number 12314.14 into field "Regression Test Documentation Standard Number"
    And the user clicks to "save" the valid change
    Then the value of 'Regression Test Documentation Standard Number' should be 12314.14
    When the user enters number 12314 into field "Regression Test Documentation Standard Number"
    And the user clicks to "save" the valid change
    Then the value of 'Regression Test Documentation Standard Number' should be 12314
    When the user enters date 30/02/2012 into field 'Regression Test Documentation Standard Date'
    And the user clicks to "save" the invalid change
    Then the 'Regression Test Documentation Standard Date' should display the error message 'Not valid! Please make sure that your value matches property type'
    When the user clicks to 'cancel' the invalid change
    And the user enters date 01/01/2020 into field 'Regression Test Documentation Standard Date'
    And the user clicks to 'save' the valid change
    Then the value of 'Regression Test Documentation Standard Date' should be Jan 1, 2020
    When the user enters string 'this is some text' into field 'Regression Test Documentation Standard URL'
    And the user clicks to 'save' the invalid change
    Then the 'Regression Test Documentation Standard URL' should display the error message 'Not valid! Please make sure that your value matches property type'
    When the user clicks to 'cancel' the invalid change
    And  the user enters string 'https://www.seismi.net' into field 'Regression Test Documentation Standard URL'
    And the user clicks to 'save' the valid change
    Then the value of 'Regression Test Documentation Standard URL' should be 'https://www.seismi.net'
    When the user enters boolean true into field 'Regression Test Documentation Standard Boolean'
    And the user clicks to 'save' the valid change
    Then the value of 'Regression Test Documentation Standard Boolean' should be true
    When the user enters string 'This is some text' into field "Regression Test Documentation Standard String"
    And the user clicks to 'save' the valid change
    Then the value of 'Regression Test Documentation Standard String' should be 'This is some text'

