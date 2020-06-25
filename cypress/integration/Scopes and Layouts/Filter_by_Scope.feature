@core
Feature: Filtering by scope
  As a user, I want to be able to apply a filter using a scope and check that the results are correct

  Background:
    Given a valid user is logged in
    And the user selects Scopes and Layouts menu item
    And the scope called 'Automated Regression Test Scope' does not exist
    And the user selects Work Package menu item
    And the work package 'Automated Regression Test Work Package' does not exist
    And the user has created and selected a work package called 'Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the user selects Topology menu item
    And the "System View" layer is selected
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu

  @scopes_layouts
  Scenario:  Create a new scope and add an existing system to it. Check that on selecting that scope in /topology, only that system appears. Also check it is in the list of items in scope in the /scopes-and-layouts page.
    Given the "Topology" "Systems" Tab is selected
    And the user creates a new 'transactional' system with name 'Automated Regression Test Transaction System'
    And the user selects Scopes and Layouts menu item
    And the scope called 'Automated Regression Test Scope' does not exist
    And the scope called 'Automated Updated Regression Test Scope' does not exist
    And the user creates a new scope called 'Automated Regression Test Scope'
    And the user selects Topology menu item
    And the "System View" layer is selected
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user selects the 'system' 'Automated Regression Test Transaction System' in the 'systems' table
    And the user clicks on the system's right hand side scope button
    When the user adds the system 'Automated Regression Test Transaction System' to the scope 'Automated Regression Test Scope'
    Then the scope 'Automated Regression Test Scope' should be visible in the scope table
    And the user reloads the Topology page
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user selects the 'system' 'Automated Regression Test Transaction System' in the 'systems' table
    And the user clicks on the system's right hand side scope button
    Then the scope 'Automated Regression Test Scope' should be visible in the scope table

  @scopes_layouts @focus
  Scenario:  Add a system to an existing scope, check on selecting that scope in /topology that the new system appears including systems that were already in scope and links that go from the new system to the system previously in scope. Also check it is in the list of items in scope in the /scopes-and-layouts page.
    Given the user selects Scopes and Layouts menu item
    And the user creates a new scope called 'Automated Regression Test Scope'
    And the user selects Topology menu item
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected

    And the user creates a new 'reporting' system with name 'Automated Regression Test Reporting System'
    And the user selects the 'system' 'Automated Regression Test Reporting System' in the 'systems' table
    And the user clicks on the system's right hand side scope button
    And the user adds the system 'Automated Regression Test Reporting System' to the scope 'Automated Regression Test Scope'

    And the user creates a new 'transactional' system with name 'Automated Regression Test Transaction System'
    And the user selects the 'system' 'Automated Regression Test Transaction System' in the 'systems' table
    And the user adds the system 'Automated Regression Test Transaction System' to the scope 'Automated Regression Test Scope'

    And the user creates a new 'master data' system with name 'Automated Regression Test Master Data System'
    And the user selects the 'system' 'Automated Regression Test Master Data System' in the 'systems' table
    And the user adds the system 'Automated Regression Test Master Data System' to the scope 'Automated Regression Test Scope'

    And the "Topology" "Interfaces" Tab is selected

    And the user creates a new 'data' interface with name 'Automated Regression Test link' between 'Automated Regression Test Transaction System' and 'Automated Regression Test Reporting System'
    And the user selects the 'interface' 'Automated Regression Test link' in the 'interfaces' table
    And the user adds the interface 'Automated Regression Test link' to the scope 'Automated Regression Test Scope'

    And the user creates a new 'master data' interface with name 'Automated Regression Test link 1' between 'Automated Regression Test Master Data System' and 'Automated Regression Test Transaction System'
    And the user selects the 'interface' 'Automated Regression Test link 1' in the 'interfaces' table
    And the user adds the interface 'Automated Regression Test link 1' to the scope 'Automated Regression Test Scope'

    And the user creates a new 'master data' interface with name 'Automated Regression Test link 2' between 'Automated Regression Test Master Data System' and 'Automated Regression Test Reporting System'
    And the user selects the 'interface' 'Automated Regression Test link 2' in the 'interfaces' table
    And the user adds the interface 'Automated Regression Test link 2' to the scope 'Automated Regression Test Scope'

    And the user selects Topology menu item
    And the "System View" layer is selected
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user selects the 'system' 'Automated Regression Test Transaction System' in the 'systems' table
    And the user clicks on the system's right hand side scope button
    When the user adds the system 'Automated Regression Test Transaction System' to the scope 'Automated Regression Test Scope'
    Then the scope 'Automated Regression Test Scope' should be visible in the scope table
    And the user reloads the Topology page
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user selects the 'system' 'Automated Regression Test Transaction System' in the 'systems' table
    And the user clicks on the system's right hand side scope button
    Then the scope 'Automated Regression Test Scope' should be visible in the scope table
