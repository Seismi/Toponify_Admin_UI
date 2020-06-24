@core
Feature: Topology Radio Feature
  As a user, I want to be able to see the radio assigned to component

  Background:
    Given a valid user is logged in
  
  @topology @radio
  Scenario: Create new RADIO and cancel
    When the user selects Radios menu item
    And the radio 'Automatic Regression Test Radio' does not exist
    And the user clicks on create new radio at the button of the radio table
    And the user creates a radio with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And the user cancels the creation of the radio

  @topology @radio
  Scenario: Create new RADIO and confirm
    When the user selects Radios menu item
    And the radio 'Automatic Regression Test Radio' does not exist
    And the user clicks on create new radio at the button of the radio table
    And the user creates a radio with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And confirms the creation of the radio

  @topology @work_package
  Scenario: Create new Work Package and cancel
    When the user selects Work Package menu item
    And the work package 'Automated Regression Test Work Package' does not exist
    And the user clicks the create work package button in the work packages table
    And the user creates a work package called 'Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the user cancels the work package create

  @topology @work_package
  Scenario: Create new Work Package and confirm
    When the user selects Work Package menu item
    And the work package 'Automated Regression Test Work Package' does not exist
    And the user has created and selected a work package called 'Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'

  @topology @radio
  Scenario: Assign RADIO to component
    When the user selects Topology menu item
    And the "System View" layer is selected
    And the work package 'Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user creates a new 'transactional' system with name 'Automated Regression Test Transaction System'
    And the user selects the 'system' 'Automated Regression Test Transaction System' in the 'systems' table
    And the user clicks on the system's right hand side radio button
    And the user assign radio 'Automatic Regression Test Risk 1' to component with work package selected 'Automated Regression Test Work Package'
    And the user clicks on the radio
    And the user edits the description to 'Automatic regression test description change'
    And saves the change
    And provides the reason 'Automated regression test description change'
    And the radio with title 'Automatic Regression Test Risk 1' should be immediately visible in the radio table
    And the radio with the title 'Automatic Regression Test Risk 1' should have the category 'risk', status 'new', description 'Automatic regression test description change', assigned to '', be actioned by '', with mitigation resolution '' and have severity 1 and probability 2
    And in the dialogue tab, a new entry appears with today's date, the user's name, the message 'Automated regression test description change'
    And on expanding the entry, the user can see a change applied on the description with the value set from 'Automatic Regression Test Risk 1 Description' to 'Automatic regression test description change'
