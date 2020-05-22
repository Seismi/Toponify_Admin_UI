Feature: Basic create, read, update and delete for RADIOs in the /radio screen
  As a user, I want to be able to create, read, update and delete RADIOs directly in the RADIO screen.

  Background:
    Given a valid user is logged in
    And the user selects Radios menu item

  Scenario: Cancel Closing RADIO
	  Given the radio 'Automatic Regression Test Risk 1' exists with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic regression test description change' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2 
	  When the user closes the radio 'Automatic Regression Test Risk 1'
    And cancels when asked to provide the reason for the change
    Then the radio with title 'Automatic Regression Test Risk 1' should be immediately visible in the radio table
    And the radio with the title 'Automatic Regression Test Risk 1' should have the category 'risk', status 'new', description 'Automatic regression test description change', assigned to '', be actioned by '', with mitigation resolution '' and have severity 1 and probability 2

  Scenario: Closing RADIO
	  Given the radio 'Automatic Regression Test Risk 1' exists with title 'Automatic Regression Test Risk 1', category 'risk', status 'new', description 'Automatic regression test description change' which is assigned to '' and should be actioned by '' and mitigation resolution '' and have severity 1 and probability 2 
	  When the user closes the radio 'Automatic Regression Test Risk 1'
	  And provides the reason 'Automated regression test closing'
    Then the radio with title 'Automatic Regression Test Risk 1' should be immediately visible in the radio table
    And the radio with the title 'Automatic Regression Test Risk 1' should have the category 'risk', status 'closed', description 'Automatic regression test description change', assigned to '', be actioned by '', with mitigation resolution '' and have severity 1 and probability 2
    And the delete button should be visible
    And in the dialogue tab, a new entry appears with today's date, the user's name, the message 'Automated regression test closing'
    And on expanding the entry, the user can see a change applied on the status with the value set from 'new' to 'closed'
