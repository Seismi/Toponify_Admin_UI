Feature: Basic create, read, update and delete for RADIOs in the /radio screen
  As a user, I want to be able to create, read, update and delete RADIOs directly in the RADIO screen.

  Background:
    Given a valid user is logged in
    And the user selects Radios menu item
    And the radio 'Automatic Regression Test Risk 1' does not exist

    @focus
  Scenario: Start creating radio then cancel
    When the user clicks on create new radio at the buttom of the radio table
    And the user creates a radio with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution ''
    And the user cancels the creation of the radio
    And the radio with title 'Automatic Regression Test Risk 1' should not be immediately visible in the radio table

  Scenario: Create simple radio
    When the user clicks on create new radio at the bottom of the radio table
    And the user creates a radio with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2  # No Assigned To, Action By or Mitigation on purpose - Please make sure the code does not fill in anything rather than tries to fill in a blank string
    And confirms the creation of the radio
    Then the radio with title 'Automatic Regression Test Risk 1' should be immediately visible in the RADIO table
    And the radio with the title 'Automatic Regression Test Risk 1' should have the category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description', assigned to '', be actioned by '', with mitigation resolution '' and have severity 1 and probability 2

  Scenario: Create a complete RADIO
  	When the user clicks on create a new RADIO at the bottom of the RADIO table
  	And the user creates a RADIO with title 'Automatic Regression Test Assumption 2', category 'assumption', status 'open', description 'Automatic Regresssion Test Assumption 2 with full details', which is assigned to 'Automated (DO NOT DELETE) Regression-Test' and should be actioned by '30/12/2020' and mitigation resolution 'Automatic Regression Test Assumption 2 Mitigation' and have severity 1 and probability 2
  	And confirms the creation of the RADIO
  	Then the RADIO with the title 'Automatic Regression Test Assumption 2' should be immediately visible in the RADIO table
  	And the RADIO with the title 'Automatic Regression Test Assumption 2' should have the category 'assumption', status 'open', description 'Automatic Regression Test 2 with full details', assigned to 'Automated (DO NOT DELETE) Regression-Test', should be actioned by '30/12/2020', with mitigation resolution 'Automatic Regression Test Assumption 2 Mitigation', severity 1 and probability 2
