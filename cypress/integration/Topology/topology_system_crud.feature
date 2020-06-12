@core
Feature: Topology Systems Layer Feature
  As a user, I want to be able to add and modify the components of the systems layer in the topology area of the application

  Background:
    Given a valid user is logged in
    And the user selects Work Package menu item
    And the work package 'Automated Regression Test Work Package' does not exist
    And the user has created and selected a work package called 'Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'

  Scenario Outline: Add system to the System View and check that they save to the table
    Given the user selects Topology menu item
    And the "System View" layer is selected
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    When the user creates a new '<component_type>' system with name '<name>'
    Then the 'system' '<name>' should exist in the table immediately
    #And the 'system' '<name>' should exist on the canvas immediately
    And the user selects the 'system' '<name>' in the 'systems' table
    And the user clicks on the system's right hand side details button
    And the details panel should reflect the reference number: '', name: '<name>', category: '<component_type>', description: '', owners '' immediately
    And the user reloads the Topology page
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user selects the 'system' '<name>' in the 'systems' table
    And the 'system' '<name>' should exist in 'Systems' table in the 'Automated Regression Test Work Package' work package after reload
    And the user clicks on the system's right hand side details button
    #And the 'system' '<name>' should exist on the canvas in the 'Automated Regression Test Work Package' work package after reload
    And the details panel should reflect the reference number: '', name: '<name>', category: '<component_type>', description: '', owners '' immediately
    Examples:
      |name|component_type|
      |Automated Regression Test Transaction System|transactional|
      |Automated Regression Test Reporting System|reporting|
      |Automated Regression Test Analytical System|analytical|
      |Automated Regression Test File System|file|
      |Automated Regression Test Master Data System|master data|
      |Automated Regression Test Transaction System|transactional|
      |Automated Regression Test Reporting System|reporting|
      |Automated Regression Test Analytical System|analytical|
      |Automated Regression Test File System|file|
      |Automated Regression Test Master Data System|master data|
      |Automated Regression Test Transaction System|transactional|
      |Automated Regression Test Reporting System|reporting|
      |Automated Regression Test Analytical System|analytical|
      |Automated Regression Test File System|file|
      |Automated Regression Test Master Data System|master data|
      |Automated Regression Test Transaction System|transactional|
      |Automated Regression Test Reporting System|reporting|
      |Automated Regression Test Analytical System|analytical|
      |Automated Regression Test File System|file|
      |Automated Regression Test Master Data System|master data|

  Scenario Outline: Update System Component via table and check results are correctly saved
    Given the user selects Topology menu item
    And the "System View" layer is selected
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user creates a new '<type>' system with name '<name>'
    And the user selects the 'system' '<name>' in the 'systems' table
    And the user clicks on the system's right hand side details button
    When the user changes the 'system' reference number: '<new_reference>', name: '<new_name>', category: '<new_type>', description: '<new_description>', owners '<new_owner>'
    Then the details panel should reflect the reference number: '<new_reference>', name: '<new_name>', category: '<new_type>', description: '<new_description>', owners '<new_owner>' immediately
    And the user reloads the Topology page
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user selects the 'system' '<new_name>' in the 'systems' table
    And the user clicks on the system's right hand side details button
    And the details panel should reflect the reference number: '<new_reference>', name: '<new_name>', category: '<new_type>', description: '<new_description>', owners '<new_owner>' immediately
    Examples:
      |name|type|new_reference|new_name|new_type|new_description|new_owner|
      |Automated Regression Test Transaction System|transactional|test1|Automated Updated Regression Test Reporting System|reporting|Updated to test the write to details pane|Automated Regression Test Update Team (DO NOT DELETE)|

  Scenario Outline: Delete System Component via table and check system is correctly deleted
    Given the user selects Topology menu item
    And the "System View" layer is selected
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user creates a new '<type>' system with name '<name>'
    And the user selects the 'system' '<name>' in the 'systems' table
    And the user clicks on the system's right hand side details button
    When the user deletes the component '<name>'
    Then the 'system' '<name>' should not exist in the table immediately
    And the user reloads the Topology page
    And the 'system' '<name>' should not exist in 'Systems' table in the 'Automated Regression Test Work Package' work package after reload
    Examples:
      |name|type|
      |Automated Regression Test Transaction System|transactional|

  Scenario Outline: Add group and system to the System View and check that they save to the grouped systems table
    Given the user selects Topology menu item
    And the "System View" layer is selected
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user creates a new '<group_type>' system with name '<group_name>'
    And the user creates a new '<component_type>' system with name '<name>'
    And the user selects the 'system' '<name>' in the 'systems' table
    And the user clicks on the system's right hand side details button
    When the user adds system '<name>' to group '<group_name>'
    Then the grouped info table should contain '<group_name>'
    And the user reloads the Topology page
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user selects the 'system' '<name>' in the 'systems' table
    And the user clicks on the system's right hand side details button
    Then the grouped info table should contain '<group_name>'

    Examples:
      |name|component_type|group_name|group_type|
      |Automated Regression Test Transaction System|transactional|Automated Regression Test Transaction Group|transactional|

###########################################################################################################################
#                                           INTERFACES                                                                    #
###########################################################################################################################

  Scenario Outline: Add interfaces to the System View and check that they save to the table and canvas
    Given the user selects Topology menu item
    And the "System View" layer is selected
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user creates a new '<source_type>' system with name '<source_name>'
    And the user creates a new '<target_type>' system with name '<target_name>'
    And the "Topology" "Interfaces" Tab is selected
    When the user creates a new '<interface_type>' interface with name '<name>' between '<source_name>' and '<target_name>'
    Then the 'interface' '<name>' should exist in the table immediately
    And the user reloads the Topology page
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Interfaces" Tab is selected
    And the user selects the 'interface' '<name>' in the 'interfaces' table
    And the 'interface' '<name>' should exist in 'Interfaces' table in the 'Automated Regression Test Work Package' work package after reload
    Examples:
      |name|interface_type|source_name|source_type|target_name|target_type|
      |Automated Regression Test (Transaction to Reporting)|data|Automated Regression Test Transaction System|transactional|Automate Regression Test Reporting System|reporting|
#    |Automate Regression Test (Transaction to Reporting)|master data|Automate Regression Test Transaction System|transactional|Automate Regression Test Reporting System|reporting|

  Scenario Outline: Update interface via table and check results are correctly saved
    Given the user selects Topology menu item
    And the "System View" layer is selected
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user creates a new '<source_type>' system with name '<source_name>'
    And the user creates a new '<target_type>' system with name '<target_name>'
    And the "Topology" "Interfaces" Tab is selected
    And the user creates a new '<interface_type>' interface with name '<name>' between '<source_name>' and '<target_name>'
    And the user selects the 'interface' '<name>' in the 'interfaces' table
    And the user clicks on the link's right hand side details button
    When the user changes the 'link' reference number: '<new_reference>', name: '<new_name>', category: '<new_type>', description: '<new_description>', owners '<new_owner>'
    Then the details panel should reflect the reference number: '<new_reference>', name: '<new_name>', category: '<new_type>', description: '<new_description>', owners '<new_owner>' immediately
    And the user reloads the Topology page
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Interfaces" Tab is selected
    And the user selects the 'interface' '<new_name>' in the 'interfaces' table
    And the user clicks on the link's right hand side details button
    And the details panel should reflect the reference number: '<new_reference>', name: '<new_name>', category: '<new_type>', description: '<new_description>', owners '<new_owner>' immediately
    Examples:
      |name|interface_type|source_name|source_type|target_name|target_type|new_reference|new_name|new_type|new_description|new_owner|
      |Automated Regression Test (Transaction to Reporting)|data|Automated Regression Test Transaction System|transactional|Automate Regression Test Reporting System|reporting|test1|Automated Updated Regression Test Reporting System|master data|Updated to test the write to details pane|Automated Regression Test Update Team (DO NOT DELETE)|

  Scenario Outline: Delete interface via table and check results are correctly saved
    Given the user selects Topology menu item
    And the "System View" layer is selected
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user creates a new '<source_type>' system with name '<source_name>'
    And the user creates a new '<target_type>' system with name '<target_name>'
    And the "Topology" "Interfaces" Tab is selected
    And the user creates a new '<interface_type>' interface with name '<name>' between '<source_name>' and '<target_name>'
    And the user selects the 'interface' '<name>' in the 'interfaces' table
    And the user clicks on the link's right hand side details button
    When the user deletes the interface '<name>'
    Then the 'interface' '<name>' should not exist in the table immediately
    And the user reloads the Topology page
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Interfaces" Tab is selected
    And the 'interface' '<name>' should not exist in 'Interfaces' table in the 'Automated Regression Test Work Package' work package after reload

  Examples:
    |name|interface_type|source_name|source_type|target_name|target_type|
    |Automated Regression Test (Transaction to Reporting)|data|Automated Regression Test Transaction System|transactional|Automate Regression Test Reporting System|reporting|
