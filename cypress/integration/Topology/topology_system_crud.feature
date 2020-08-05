@core
Feature: Topology Systems CRUD Feature
  As a user, I want to be able to add and modify the components of the systems layer in the topology area of the application

  Background:
    Given a valid user is logged in
    And the user selects Work Package menu item
    And the work package 'Created Automated Regression Test Work Package' does not exist
    And the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'

  @topology @topology_system @focus
  Scenario Outline: Add system to the System View and check that they save to the table
    Given the user selects Topology menu item
    #And the "System View" layer is selected
    #And the work package 'Created Automated Regression Test Work Package' is editable on the 'Work Package' menu
    #And the "Topology" "Systems" Tab is selected
    #When the user creates a new '<component_type>' system with name '<name>'
    #Then the 'system' '<name>' should exist in the table immediately
    #And the 'system' '<name>' should exist on the canvas immediately
    #And the user selects the 'system' '<name>' in the 'systems' table
    #And the user clicks on the system's right hand side details button
    #And the details panel should reflect the reference number: '', name: '<name>', category: '<component_type>', description: '', owners '' immediately
    #And the user reloads the Topology page
    #And the work package 'Created Automated Regression Test Work Package' is editable on the 'Work Package' menu
    #And the "Topology" "Systems" Tab is selected
    #And the user selects the 'system' '<name>' in the 'systems' table
    #And the 'system' '<name>' should exist in 'Systems' table in the 'Created Automated Regression Test Work Package' work package after reload
    #And the user clicks on the system's right hand side details button
    #And the 'system' '<name>' should exist on the canvas in the 'Created Automated Regression Test Work Package' work package after reload
    #And the details panel should reflect the reference number: '', name: '<name>', category: '<component_type>', description: '', owners '' immediately
    Examples:
      |name|component_type|
      |Automated Regression Test Transaction System|transactional|
      #|Automated Regression Test Reporting System|reporting|
      #|Automated Regression Test Analytical System|analytical|
      #|Automated Regression Test File System|file|
      #|Automated Regression Test Master Data System|master data|

