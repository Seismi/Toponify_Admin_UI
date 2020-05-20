Feature: Documentation Standards CRUD
  As a user, I want to manage all available documentation standards via the documentation standards page.

  Background:
    Given a valid user is logged in
    And the user selects Work Package menu item
    And the work package 'Automated Regression Test Work Package' does not exist
    And the user has created and selected a work package called 'Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the user selects Documentation Standard menu item
    And the documentation standard 'Automated Regression Test Doc Std UT1' does not exist
    And the documentation standard 'Automated Updated Regression Test Doc Std UT1' does not exist
  # TODO add checks on other pages (/topology, /radio, /reports...)


  Scenario: Cancel Create Documentation Standard
    When the user creates the documentation standard 'Automated Regression Test Doc Std UT1' with description 'Regression Test 1', type 'Boolean' against 'Everywhere' component
    And the user cancels the creation of the documentation standard
    Then the document standard 'Automated Regression Test Doc Std UT1' should not exist in the documentation standards table
    And the user selects Work Package menu item
    And the user selects the work package 'Automated Regression Test Work Package'
    And the 'Work Package' 'Documentation Standards' pane is open
    And the documentation standard 'Automated Regression Test Doc Std UT1' should not be visible


  Scenario: Create Documentation Standard
    When the user creates the documentation standard 'Automated Regression Test Doc Std UT1' with description 'Regression Test 1', type 'Boolean' against 'Everywhere' component
    And the user confirms the creation of the documentation standard
    Then the documentation standard 'Automated Regression Test Doc Std UT1' should exist with type 'Boolean' everywhere
    And the user selects Work Package menu item
    And the user selects the work package 'Automated Regression Test Work Package'
    And the 'Work Package' 'Documentation Standards' pane is open
    And the documentation standard 'Automated Regression Test Doc Std UT1' should be visible

  Scenario: Cancel Update of documentation standard
    Given the user creates the documentation standard 'Automated Regression Test Doc Std UT1' with description 'Regression Test 1', type 'Boolean' against 'Everywhere' component
    And the user confirms the creation of the documentation standard
    When the user updates the documentation standard 'Automated Regression Test Doc Std UT1' to have name 'Automated Updated Regression Test Doc Std UT1' with description 'Regression Updated Test 1', type 'Text' and removes the 'Work Package' component
    And the user cancels the update of the documentation standard
    Then the documentation standard 'Automated Regression Test Doc Std UT1' should exist with type 'Boolean' everywhere apart from 'Work Package'
    And the user reloads the Documentation Standards page
    And the documentation standard 'Automated Regression Test Doc Std UT1' should exist with type 'Boolean' everywhere


  Scenario: Cancel Update of documentation standard
    Given the user creates the documentation standard 'Automated Regression Test Doc Std UT1' with description 'Regression Test 1', type 'Boolean' against 'Everywhere' component
    And the user confirms the creation of the documentation standard
    When the user updates the documentation standard 'Automated Regression Test Doc Std UT1' to have name 'Automated Updated Regression Test Doc Std UT1' with description 'Regression Updated Test 1', type 'Text' and removes the 'Work Package' component
    And the user confirms the update of the documentation standard
    Then the documentation standard 'Automated Regression Test Doc Std UT1' should exist with type 'Boolean' everywhere apart from 'Work Package'
    And the user reloads the Documentation Standards page
    And the documentation standard 'Automated Updated Regression Test Doc Std UT1' should exist with type 'Text' everywhere apart from 'Work Package'
    And the user selects Work Package menu item
    And the user selects the work package 'Automated Regression Test Work Package'
    And the 'Work Package' 'Documentation Standards' pane is open
    And the documentation standard 'Automated Regression Test Doc Std UT1' should be visible

  @focus
  Scenario: Delete documentation standard
    Given the user creates the documentation standard 'Automated Regression Test Doc Std UT1' with description 'Regression Test 1', type 'Boolean' against 'Everywhere' component
    And the user confirms the creation of the documentation standard
    When the user deletes the documentation standard 'Automated Regression Test Doc Std UT1'
    When the user selects Work Package menu item
    And the user selects the work package 'Automated Regression Test Work Package'
    And the 'Work Package' 'Documentation Standards' pane is open
    Then the documentation standard 'Automated Regression Test Doc Std UT1' should not be visible

#    And deselects the component 'Work Package'
#    And cancels the change

#  Scenario: Update

#  Scenario: Cancel Delete

  #Scenario: Delete
