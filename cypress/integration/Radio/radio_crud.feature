@core
Feature: Basic create, read, update and delete for RADIOs in the /radio screen
  As a user, I want to be able to create, read, update and delete RADIOs directly in the RADIO screen.

  Background:
    Given a valid user is logged in
    And the user selects Radios menu item
    And the radio 'Created Automatic Regression Test Risk 1' does not exist
    And the user clicks on create new radio at the button of the radio table

  @radio
  Scenario: Start creating radio then cancel
    When the user creates a radio with title 'Created Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And the user cancels the creation of the radio
    And the radio with title 'Created Automatic Regression Test Risk 1' should not be immediately visible in the radio table

  @radio
  Scenario: Create simple radio
    And the user creates a radio with title 'Created Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And confirms the creation of the radio
    Then the radio with title 'Created Automatic Regression Test Risk 1' should be immediately visible in the radio table
    And the radio with the title 'Created Automatic Regression Test Risk 1' should have the category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description', assigned to '', be actioned by '', with mitigation resolution '' and have severity 1 and probability 2

  @radio
  Scenario: Create a complete radio
  	And the user creates a radio with title 'Automatic Regression Test Assumption 2', category 'assumption', status 'open', description 'Automatic Regresssion Test Assumption 2 with full details' which is assigned to 'Automated (DO NOT DELETE) Regression-Test' and should be actioned by 'Wed Dec 30 2020' and mitigation resolution 'Automatic Regression Test Assumption 2 Mitigation' and have severity 1 and probability 2
  	And confirms the creation of the radio
  	Then the radio with title 'Automatic Regression Test Assumption 2' should be immediately visible in the radio table
  	And the radio with the title 'Automatic Regression Test Assumption 2' should have the category 'assumption', status 'open', description 'Automatic Regresssion Test Assumption 2 with full details', assigned to 'Automated (DO NOT DELETE) Regression-Test', be actioned by 'Wed Dec 30 2020', with mitigation resolution 'Automatic Regression Test Assumption 2 Mitigation' and have severity 1 and probability 2

  @radio
  Scenario: Start updating radio then cancel
    Given the user creates a radio with title 'Created Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And confirms the creation of the radio
	  And the radio 'Created Automatic Regression Test Risk 1' exists with title 'Created Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And the user edits the description to 'Automatic regression test description change'
    And cancels the change
    Then the radio with title 'Created Automatic Regression Test Risk 1' should be immediately visible in the radio table
    And the radio with the title 'Created Automatic Regression Test Risk 1' should have the category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description', assigned to '', be actioned by '', with mitigation resolution '' and have severity 1 and probability 2

  @radio
  Scenario: Start updating RADIO then cancel on reply
    Given the user creates a radio with title 'Created Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And confirms the creation of the radio
	  And the radio 'Created Automatic Regression Test Risk 1' exists with title 'Created Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And the user edits the description to 'Automatic regression test description change'
    And saves the change
    And cancels when asked to provide the reason for the change
    Then the radio with title 'Created Automatic Regression Test Risk 1' should be immediately visible in the radio table
    And the radio with the title 'Created Automatic Regression Test Risk 1' should have the category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description', assigned to '', be actioned by '', with mitigation resolution '' and have severity 1 and probability 2

  @radio
  Scenario: Update RADIO
    Given the user creates a radio with title 'Created Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And confirms the creation of the radio
	  And the radio 'Created Automatic Regression Test Risk 1' exists with title 'Created Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And the user edits the description to 'Automatic regression test description change'
    And saves the change
    And provides the reason 'Automated regression test description change'
    Then the radio with title 'Created Automatic Regression Test Risk 1' should be immediately visible in the radio table
    And the radio with the title 'Created Automatic Regression Test Risk 1' should have the category 'risk', status 'new', description 'Automatic regression test description change', assigned to '', be actioned by '', with mitigation resolution '' and have severity 1 and probability 2
    And in the dialogue tab, a new entry appears with today's date, the user's name, the message 'Automated regression test description change'
    And on expanding the entry, the user can see a change applied on the description with the value set from 'Automatic Regression Test Risk 1 Description' to 'Automatic regression test description change'

  @radio
  Scenario: Cancel Closing RADIO
    Given the user creates a radio with title 'Created Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic regression test description change' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And confirms the creation of the radio
	  And the radio 'Created Automatic Regression Test Risk 1' exists with title 'Created Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic regression test description change' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
	  And the user closes the radio 'Created Automatic Regression Test Risk 1'
    And cancels when asked to provide the reason for the change
    Then the radio with title 'Created Automatic Regression Test Risk 1' should be immediately visible in the radio table
    And the radio with the title 'Created Automatic Regression Test Risk 1' should have the category 'risk', status 'new', description 'Automatic regression test description change', assigned to '', be actioned by '', with mitigation resolution '' and have severity 1 and probability 2

  @radio
  Scenario: Closing RADIO
    Given the user creates a radio with title 'Created Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic regression test description change' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And confirms the creation of the radio
	  And the radio 'Created Automatic Regression Test Risk 1' exists with title 'Created Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic regression test description change' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
	  And the user closes the radio 'Created Automatic Regression Test Risk 1'
	  And provides the reason 'Automated regression test closing'
    Then the radio with title 'Created Automatic Regression Test Risk 1' should be immediately visible in the radio table
    And the radio with the title 'Created Automatic Regression Test Risk 1' should have the category 'risk', status 'closed', description 'Automatic regression test description change', assigned to '', be actioned by '', with mitigation resolution '' and have severity 1 and probability 2
    And the delete button should be visible
    And in the dialogue tab, a new entry appears with today's date, the user's name, the message 'Automated regression test closing'
    And on expanding the entry, the user can see a change applied on the status with the value set from 'new' to 'closed'

  @radio
  Scenario: Cancel Delete RADIO
    Given the user creates a radio with title 'Created Automatic Regression Test Risk 1', category 'risk', status 'closed', description 'Automatic regression test description change' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And confirms the creation of the radio
	  And the radio 'Created Automatic Regression Test Risk 1' exists with title 'Created Automatic Regression Test Risk 1', category 'risk', status 'closed', description 'Automatic regression test description change' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
	  And the user updates the filter to show closed radios
	  And the user clicks on delete
	  And the user cancels the delete
    Then the radio with title 'Created Automatic Regression Test Risk 1' should be immediately visible in the radio table
    And the radio with the title 'Created Automatic Regression Test Risk 1' should have the category 'risk', status 'closed', description 'Automatic regression test description change', assigned to '', be actioned by '', with mitigation resolution '' and have severity 1 and probability 2

  @radio
  Scenario: Delete RADIO
    Given the user creates a radio with title 'Created Automatic Regression Test Risk 1', category 'risk', status 'closed', description 'Automatic regression test description change' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And confirms the creation of the radio
	  And the radio 'Created Automatic Regression Test Risk 1' exists with title 'Created Automatic Regression Test Risk 1', category 'risk', status 'closed', description 'Automatic regression test description change' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
	  And the user updates the filter to show closed radios
	  And the user clicks on delete
	  And the user confirms the delete
    Then the radio with title 'Created Automatic Regression Test Risk 1' should not be immediately visible in the radio table

  @radio @focus
  Scenario: Create new documentation standard, assign to radio and check it is visible and editable against a radio
    Given the user creates a radio with title 'Created Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic Regression Test Risk 1 Description' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2
    And confirms the creation of the radio
    Then the user selects Documentation Standard menu item
    And the document standard 'Automatic Regression Test' does not exist
    And the user creates a documentation standard with title 'Automatic Regression Test', type 'Text' and component type 'RADIO'
    And the user confirms the creation of the documentation standard
    And the user selects Radios menu item
    And the user updates the filter to find radio with title 'Created Automatic Regression Test Risk 1'
    And the user checks if documentation standards exist with title 'Automatic Regression Test'
