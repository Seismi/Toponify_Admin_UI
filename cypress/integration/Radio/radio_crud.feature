@core
Feature: Basic create, read, update and delete for RADIOs in the /radio screen
  As a user, I want to be able to create, read, update and delete RADIOs directly in the RADIO screen.

  Background:
    Given a valid user is logged in
    And the user selects Radios menu item

  Scenario: Start creating radio then cancel
    When the radio 'Automatic Regression Test Risk 1' does not exist
    And the user clicks on create new radio at the button of the radio table
    And the user creates a radio with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And the user cancels the creation of the radio
    And the radio with title 'Automatic Regression Test Risk 1' should not be immediately visible in the radio table

  Scenario: Create simple radio
    When the radio 'Automatic Regression Test Risk 1' does not exist
    And the user clicks on create new radio at the button of the radio table
    And the user creates a radio with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And confirms the creation of the radio
    Then the radio with title 'Automatic Regression Test Risk 1' should be immediately visible in the radio table
    And the radio with the title 'Automatic Regression Test Risk 1' should have the category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description', assigned to '', be actioned by '', with mitigation resolution '' and have severity 1 and probability 2

  Scenario: Create a complete radio
    When the radio 'Automatic Regression Test Risk 1' does not exist
  	And the user clicks on create new radio at the button of the radio table
  	And the user creates a radio with title 'Automatic Regression Test Assumption 2', category 'assumption', status 'open', description 'Automatic Regresssion Test Assumption 2 with full details' which is assigned to 'Automated (DO NOT DELETE) Regression-Test' and should be actioned by 'Wed Dec 30 2020' and mitigation resolution 'Automatic Regression Test Assumption 2 Mitigation' and have severity 1 and probability 2
  	And confirms the creation of the radio
  	Then the radio with title 'Automatic Regression Test Assumption 2' should be immediately visible in the radio table
  	And the radio with the title 'Automatic Regression Test Assumption 2' should have the category 'assumption', status 'open', description 'Automatic Regresssion Test Assumption 2 with full details', assigned to 'Automated (DO NOT DELETE) Regression-Test', be actioned by 'Wed Dec 30 2020', with mitigation resolution 'Automatic Regression Test Assumption 2 Mitigation' and have severity 1 and probability 2

  Scenario: Start updating radio then cancel
    When the radio 'Automatic Regression Test Risk 1' does not exist
    And the user clicks on create new radio at the button of the radio table
    And the user creates a radio with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And confirms the creation of the radio
	  Given the radio 'Automatic Regression Test Risk 1' exists with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2 
    When the user edits the description to 'Automatic regression test description change'
    And cancels the change
    Then the radio with title 'Automatic Regression Test Risk 1' should be immediately visible in the radio table
    And the radio with the title 'Automatic Regression Test Risk 1' should have the category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description', assigned to '', be actioned by '', with mitigation resolution '' and have severity 1 and probability 2

  Scenario: Start updating RADIO then cancel on reply
    When the radio 'Automatic Regression Test Risk 1' does not exist
    And the user clicks on create new radio at the button of the radio table
    And the user creates a radio with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And confirms the creation of the radio
	  Given the radio 'Automatic Regression Test Risk 1' exists with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2 
    When the user edits the description to 'Automatic regression test description change'
    And saves the change
    And cancels when asked to provide the reason for the change
    Then the radio with title 'Automatic Regression Test Risk 1' should be immediately visible in the radio table
    And the radio with the title 'Automatic Regression Test Risk 1' should have the category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description', assigned to '', be actioned by '', with mitigation resolution '' and have severity 1 and probability 2

  Scenario: Update RADIO
    When the radio 'Automatic Regression Test Risk 1' does not exist
    And the user clicks on create new radio at the button of the radio table
    And the user creates a radio with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And confirms the creation of the radio
	  Given the radio 'Automatic Regression Test Risk 1' exists with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2 
    When the user edits the description to 'Automatic regression test description change'
    And saves the change
    And provides the reason 'Automated regression test description change'
    Then the radio with title 'Automatic Regression Test Risk 1' should be immediately visible in the radio table
    And the radio with the title 'Automatic Regression Test Risk 1' should have the category 'risk', status 'new', description 'Automatic regression test description change', assigned to '', be actioned by '', with mitigation resolution '' and have severity 1 and probability 2
    And in the dialogue tab, a new entry appears with today's date, the user's name, the message 'Automated regression test description change'
    And on expanding the entry, the user can see a change applied on the description with the value set from 'Automatic Regression Test Risk 1 Description' to 'Automatic regression test description change'

  Scenario: Cancel Closing RADIO
    When the radio 'Automatic Regression Test Risk 1' does not exist
    And the user clicks on create new radio at the button of the radio table
    And the user creates a radio with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic regression test description change' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And confirms the creation of the radio
	  Given the radio 'Automatic Regression Test Risk 1' exists with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic regression test description change' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2 
	  When the user closes the radio 'Automatic Regression Test Risk 1'
    And cancels when asked to provide the reason for the change
    Then the radio with title 'Automatic Regression Test Risk 1' should be immediately visible in the radio table
    And the radio with the title 'Automatic Regression Test Risk 1' should have the category 'risk', status 'new', description 'Automatic regression test description change', assigned to '', be actioned by '', with mitigation resolution '' and have severity 1 and probability 2

  Scenario: Closing RADIO
    When the radio 'Automatic Regression Test Risk 1' does not exist
    And the user clicks on create new radio at the button of the radio table
    And the user creates a radio with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic regression test description change' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And confirms the creation of the radio
	  Given the radio 'Automatic Regression Test Risk 1' exists with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic regression test description change' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2 
	  When the user closes the radio 'Automatic Regression Test Risk 1'
	  And provides the reason 'Automated regression test closing'
    Then the radio with title 'Automatic Regression Test Risk 1' should be immediately visible in the radio table
    And the radio with the title 'Automatic Regression Test Risk 1' should have the category 'risk', status 'closed', description 'Automatic regression test description change', assigned to '', be actioned by '', with mitigation resolution '' and have severity 1 and probability 2
    And the delete button should be visible
    And in the dialogue tab, a new entry appears with today's date, the user's name, the message 'Automated regression test closing'
    And on expanding the entry, the user can see a change applied on the status with the value set from 'new' to 'closed'

  Scenario: Cancel Delete RADIO
	  Given the radio 'Automatic Regression Test Risk 1' exists with title 'Automatic Regression Test Risk 1', category 'risk', status 'closed', description 'Automatic regression test description change' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2 
	  When the user updates the filter to show closed radios
	  And the user clicks on delete
	  And the user cancels the delete
    Then the radio with title 'Automatic Regression Test Risk 1' should be immediately visible in the radio table
    And the radio with the title 'Automatic Regression Test Risk 1' should have the category 'risk', status 'closed', description 'Automatic regression test description change', assigned to '', be actioned by '', with mitigation resolution '' and have severity 1 and probability 2

  Scenario: Delete RADIO
	  Given the radio 'Automatic Regression Test Risk 1' exists with title 'Automatic Regression Test Risk 1', category 'risk', status 'closed', description 'Automatic regression test description change' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2 
	  When the user updates the filter to show closed radios
	  And the user clicks on delete
	  And the user confirms the delete
    Then the radio with title 'Automatic Regression Test Risk 1' should not be immediately visible in the radio table
