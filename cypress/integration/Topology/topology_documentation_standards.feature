@core
Feature: Topology Documentation Standards
  As a user, I want to be able to enter documentation standards against a component on the topology

  Background:
    Given a valid user is logged in
    And the user selects Work Package menu item
    And the work package 'Created Automated Regression Test Work Package' does not exist
    And the work package 'Included to make next step work' does not exist
    And the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the user selects Documentation Standard menu item
    And the documentation standard 'Regression Test Documentation Standard Date' does not exist
    And the documentation standard 'Regression Test Documentation Standard Number' does not exist
    And the documentation standard 'Regression Test Documentation Standard URL' does not exist
    And the documentation standard 'Regression Test Documentation Standard Boolean' does not exist
    And the documentation standard 'Regression Test Documentation Standard String' does not exist
    And the documentation standard 'Regression Test Documentation Standard Date' exists with type 'Date' against 'System' component
    And the user confirms the creation of the documentation standard
    And the documentation standard 'Regression Test Documentation Standard Number' exists with type 'Number' against 'System' component
    And the user confirms the creation of the documentation standard
    And the documentation standard 'Regression Test Documentation Standard URL' exists with type 'Hyperlink' against 'System' component
    And the user confirms the creation of the documentation standard
    And the documentation standard 'Regression Test Documentation Standard Boolean' exists with type 'Boolean' against 'System' component
    And the user confirms the creation of the documentation standard
    And the documentation standard 'Regression Test Documentation Standard String' exists with type 'Text' against 'System' component
    And the user confirms the creation of the documentation standard
    And the user selects Topology menu item
    And the "System View" layer is selected
    And the work package 'Created Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user creates a new 'transactional' system with name 'Automated Regression Test Transaction System'
    And the user selects the 'system' 'Automated Regression Test Transaction System' in the 'systems' table
    And the user clicks on the system's right hand side documentation standard button

  @documentation_standards
  Scenario: the user should be able to enter values against documentation standards and systems stored on the topology
    When the user enters date 01/01/2020 into field 'Regression Test Documentation Standard Date'
    And the user clicks to 'save' the valid change
    And the user enters number 12314 into field "Regression Test Documentation Standard Number"
    And the user clicks to 'save' the valid change
    And the user enters string 'https://www.seismi.net' into field 'Regression Test Documentation Standard URL'
    And the user clicks to 'save' the valid change
    And the user enters boolean true into field 'Regression Test Documentation Standard Boolean'
    And the user clicks to 'save' the valid change
    And the user enters string 'This is some text' into field "Regression Test Documentation Standard String"
    And the user clicks to 'save' the valid change
    Then the value of 'Regression Test Documentation Standard Date' should be Jan 1, 2020
    And the value of 'Regression Test Documentation Standard Number' should be 12314
    And the value of 'Regression Test Documentation Standard URL' should be 'https://www.seismi.net'
    And the value of 'Regression Test Documentation Standard Boolean' should be true
    And the value of 'Regression Test Documentation Standard String' should be 'This is some text'
