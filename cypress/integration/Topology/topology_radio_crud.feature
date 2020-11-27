@core
Feature: Topology Radio CRUD Feature
  As a user, I want to be able to see the radio assigned to component

  Background:
    Given a valid user is logged in
    And the user selects Work Package menu item
    And the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the user selects Radios menu item
    And the radio 'Automatic Regression Test Risk 1' does not exist

  @topology @radio
  Scenario: Assign RADIO to component and cancel
    And the user clicks on create new radio at the button of the radio table
    And the user creates a radio with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to 'Automated (DO NOT DELETE) Regression-Test' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And confirms the creation of the radio
    And the user selects Topology menu item
    # And the "System View" layer is selected
    And the work package 'Created Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user creates a new 'transactional' system with name 'Automated Regression Test Transaction System'
    And the user selects the 'system' 'Automated Regression Test Transaction System' in the 'systems' table
    And the user clicks on the system's right hand side radio button
    And the user assign radio 'Automatic Regression Test Risk 1' to component with work package selected 'Created Automated Regression Test Work Package' and cancel

  @topology @radio
  Scenario: Assign RADIO to component and confirm
    And the user clicks on create new radio at the button of the radio table
    And the user creates a radio with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to 'Automated (DO NOT DELETE) Regression-Test' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And confirms the creation of the radio
    And the user selects Topology menu item
    # And the "System View" layer is selected
    And the work package 'Created Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user creates a new 'transactional' system with name 'Automated Regression Test Transaction System'
    And the user selects the 'system' 'Automated Regression Test Transaction System' in the 'systems' table
    And the user clicks on the system's right hand side radio button
    And the user assign radio 'Automatic Regression Test Risk 1' to component with work package selected 'Created Automated Regression Test Work Package'

  @topology @radio
  Scenario: Create RADIO to component and cancel
    When the user selects Topology menu item
    # And the "System View" layer is selected
    And the work package 'Created Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user creates a new 'transactional' system with name 'Automated Regression Test Transaction System'
    And the user selects the 'system' 'Automated Regression Test Transaction System' in the 'systems' table
    And the user clicks on the system's right hand side radio button
    And the user click on create new radio button
    And the user creates a radio with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to 'Automated (DO NOT DELETE) Regression-Test' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And the user cancels the radio creation

  @topology @radio
  Scenario: Create RADIO to component and confirm
    When the user selects Topology menu item
    # And the "System View" layer is selected
    And the work package 'Created Automated Regression Test Work Package' is editable on the 'Work Package' menu
    And the "Topology" "Systems" Tab is selected
    And the user creates a new 'transactional' system with name 'Automated Regression Test Transaction System'
    And the user selects the 'system' 'Automated Regression Test Transaction System' in the 'systems' table
    And the user clicks on the system's right hand side radio button
    And the user click on create new radio button
    And the user creates a radio with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to 'Automated (DO NOT DELETE) Regression-Test' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And the user confirm the radio creation
    And the user clicks on the radio
    And the user edits the description to 'Automatic regression test description change'
    And saves the change
    And provides the reason 'Automated regression test description change'
    And the radio with title 'Automatic Regression Test Risk 1' should be immediately visible in the radio table
    And the radio with the title 'Automatic Regression Test Risk 1' should have the category 'risk', status 'new', description 'Automatic regression test description change', assigned to '', be actioned by '', with mitigation resolution '' and have severity 1 and probability 2
    And in the dialogue tab, a new entry appears with today's date, the user's name, the message 'Automated regression test description change'
    And on expanding the entry, the user can see a change applied on the description with the value set from 'Automatic Regression Test Risk 1 Description' to 'Automatic regression test description change'
