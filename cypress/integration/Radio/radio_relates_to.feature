@core
Feature: RADIO add relates to
  As a user, I want to be able to add relates to and then navigate to topology or work package page

  Background:
    Given a valid user is logged in
    And the user selects Work Package menu item
    And the work package 'Created Automated Regression Test Work Package' does not exist
    Then the user clicks the create work package button in the work packages table
    And the user creates a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the user saves the work package
    When the create package pop-up should close
    And the work package 'Created Automated Regression Test Work Package' should be created
    When the user selects Topology menu item
    # And the "System View" layer is selected
    And the work package 'Created Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    When the user creates a new 'transactional' system with name 'Automated Regression Test Transaction System'
    Then the 'system' 'Automated Regression Test Transaction System' should exist in the table immediately
    When the user selects Radios menu item
    And the radio 'Created Automatic Regression Test' does not exist
    And the user clicks on create new radio at the button of the radio table
    And the user creates a radio with title 'Created Automatic Regression Test', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to 'Automated Test' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And confirms the creation of the radio
    Then the radio with title 'Created Automatic Regression Test' should be immediately visible in the radio table
    And the user selects relates to tab
    Then the user creates relates to with work package 'Created Automated Regression Test Work Package' and 'Automated Regression Test Transaction System' component
  
  @radio @relates_to
  Scenario: Click on work package name and navigate to work package page
    Given the user clicks on the work package 'Created Automated Regression Test Work Package' in the /radio details
    Then the user is redirected to the work package page and the work package 'Created Automated Regression Test Work Package' is shown in the details

  @radio @relates_to
  Scenario: Open component in topology page
    Given the user clicks on the relates to link icon with work package name 'Created Automated Regression Test Work Package'
    Then the user is redirected to the topology page with selected component 'Automated Regression Test Transaction System'