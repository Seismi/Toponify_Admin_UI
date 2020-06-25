@core
Feature: Topology Systems Layer Reports Feature
  As a user, I want to be able to see the reports that use my system when looking at the topology

  Background:
    Given a valid user is logged in
    And the user selects Work Package menu item
    And the work package 'Automated Regression Test Work Package' does not exist
    And the user has created and selected a work package called 'Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the user selects Topology menu item
    And the "System View" layer is selected
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user creates a new 'transactional' system with name 'Automated Regression Test Transaction System'
    And the user selects Reports menu item
    And the user creates a new report with the name 'Automated Regression Test Report', description 'Automated Regression Test Report description' and selects system 'Automated Regression Test Transaction System'
    And the user confirms the creation of the report

  @topology @reports
  Scenario: Add system to the System View and check that they save to the table
    When the user selects Topology menu item
    And the "System View" layer is selected
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user selects the 'system' 'Automated Regression Test Transaction System' in the 'systems' table
    And the user clicks on the system's right hand side reports button
    Then the reports table should contain the report 'Automated Regression Test Report'
