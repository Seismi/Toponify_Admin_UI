@core
Feature: Work Package Edit Radio Feature
  As a user, I want to be able to raise and modify radios against a work package

  Background:
    Given a valid user is logged in
    And the user selects Work Package menu item
    And the radio 'Created Automatic Regression Test Risk 1' does not exist against work package 'Created Automated Regression Test Work Package'
    And the radio 'Included to make next step work' does not exist against work package 'Created Automated Regression Test Work Package'
    And the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the "Work Package" "Radio" pane is open

  @radio @work_package
  Scenario: Create a risk against a work package and save
    When the user creates a radio with title 'Created Automatic Regression Test Risk 1', category 'risk', status 'open', description 'Automatic Regression Test Risk 1 Description' which is assigned to 'Automated (DO NOT DELETE) Regression-Test' and should be actioned by '12/30/2020' and mitigation resolution 'Automatic Regression Test Risk 1 Mitigation' and have severity 1 and probability 2 against work package 'Created Automated Regression Test Work Package'
    Then the radio with title 'Created Automatic Regression Test Risk 1' should be immediately visible in the work package radio table
    And the radio with title 'Created Automatic Regression Test Risk 1' should be visible after reload in the work package radio table
    And the radio with title 'Created Automatic Regression Test Risk 1' should have category 'risk', status 'open', description 'Automatic Regression Test Risk 1 Description' be assigned to 'Automated (DO NOT DELETE) Regression-Test', should be actioned by '12/30/2020', with mitigation resolution 'Automatic Regression Test Risk 1 Mitigation', severity 1 and probability 2 against work package 'Created Automated Regression Test Work Package'

  @radio @work_package
  Scenario: Update a risk against a work package, comment and save
    Given the user creates a radio with title 'Created Automatic Regression Test Risk 1', category 'risk', status 'open', description 'Automatic Regression Test Risk 1 Description' which is assigned to 'Automated (DO NOT DELETE) Regression-Test' and should be actioned by '12/30/2020' and mitigation resolution 'Automatic Regression Test Risk 1 Mitigation' and have severity 1 and probability 2 against work package 'Created Automated Regression Test Work Package'
    When the user updates the radio with title 'Created Automatic Regression Test Risk 1' to have new title 'Automatic Updated Regression Test Risk 1', category 'issue', status 'new', description 'Automatic Updated Regression Test 1 Description' which is assigned to 'Automated Shadow(DO NOT DELETE) Regression-Test-Shadow' and should be action by '12/30/2020' and mitigation resolution 'Automatic Updated Regression Test Risk 1 Mitigation' and have severity 3 and probability 5 against work package 'Created Automated Regression Test Work Package'
    And enters a comment 'Updated as part of automated regression test'
    Then the radio with title 'Automatic Updated Regression Test Risk 1' should have category 'issue', status 'new', description 'Automatic Updated Regression Test 1 Description' be assigned to 'regression.test.shadow@toponify.com', should be actioned by '12/30/2020', with mitigation resolution 'Automatic Updated Regression Test Risk 1 Mitigation', severity 3 and probability 5 against work package 'Created Automated Regression Test Work Package'
    And the discussion tab should updated with a comment by the current user saying 'Automated Regression Test Comment'
