Feature: Basic create, read, update and delete for RADIOs in the /radio screen
  As a user, I want to be able to create, read, update and delete RADIOs directly in the RADIO screen.

  Background:
    Given a valid user is logged in
    And the user selects Radios menu item

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