@core
Feature: Topology Systems Layer Feature
  As a user, I want to be able to add and modify the components of the systems layer in the topology area of the application

  Background:
    Given a valid user is logged in
    And the user selects Work Package menu item
    And the work package 'Automated Regression Test Work Package' does not exist
    And the user has created and selected a work package called 'Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    Given the user selects Topology menu item
    And the work package 'Automated Regression Test Work Package' is editable
    And the "Topology" "Systems" Tab is selected
    And the "System View" layer is selected
    And the user creates a new 'transactional' system with name 'Automated Regression Test Transactional System'

  Scenario: Add system to scope and check it appears
    Given  the user selects the 'system' 'Automated Regression Test Transactional System' in the 'systems' table
    And the user clicks on the system's right hand side scope button
    When the user adds the system 'Automated Regression Test Transactional System' to scope 'Automated Regression Test Scope'
    And the scope 'Automated Regression Test Scope' is selected in the topology scopes drop down
    Then the scope 'Automated Regression Test Scope' should appear in system's scope list
    When the user selects Scopes and Layouts menu item
    And the user selects the scope called 'Automated Regression Test Scope'
    And  the system 'Automated Regression Test Transactional System' should appear in the scope's system list
