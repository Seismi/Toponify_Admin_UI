@admin
Feature: Create and amend Teams
  As a user, I want to be able to edit my details

  Background:
    Given a valid user is logged in
    And the user selects Settings menu item
    And the 'Settings' 'Teams' tab is selected
    And the team 'Automated Regression Test Team (DO NOT DELETE)' exists with name 'Automated Regression Test Team (DO NOT DELETE) Description'
    And the 'Settings' 'All Users' tab is selected
    And the user with email address 'regression.test.core@toponify.com' exists with first name 'Automated (DO NOT DELETE)', last name 'Regression-Test', phone number '01234567890', team 'Automated Regression Test Team (DO NOT DELETE),Automated Regression Test Update Team (DO NOT DELETE)' and role 'Administrator'
    And the user with email address 'regression.test.shadow@toponify.com' exists with first name 'Automated Shadow(DO NOT DELETE)', last name 'Regression-Test-Shadow', phone number '01234567890', team 'Automated Regression Test Team (DO NOT DELETE),Automated Regression Test Update Team (DO NOT DELETE)' and role 'Administrator'


  Scenario: Set the design authority flag
    Given the 'Settings' 'Teams' tab is selected
    And the team 'Automated Regression Test Team (DO NOT DELETE)' is selected in the teams table
    When the user makes the team 'Automated Regression Test Team (DO NOT DELETE)' a design authority
    Then the team 'Automated Regression Test Team (DO NOT DELETE)' should be a design authority

  Scenario: Delete a user from the team
    Given the 'Settings' 'Teams' tab is selected
    And the team 'Automated Regression Test Team (DO NOT DELETE)' is selected in the teams table
    When the user removes user 'regression.test.core@toponify.com' from team 'Automated Regression Test Team (DO NOT DELETE)'
    Then the user 'regression.test.core@toponify.com' should not be a member of team 'Automated Regression Test Team (DO NOT DELETE)'

  Scenario: Add a user to the team
    Given the 'Settings' 'Teams' tab is selected
    And the team 'Automated Regression Test Team (DO NOT DELETE)' is selected in the teams table
    When the user removes user 'regression.test.core@toponify.com' from team 'Automated Regression Test Team (DO NOT DELETE)'
    And the user adds user 'regression.test.core@toponify.com' to team 'Automated Regression Test Team (DO NOT DELETE)'
    Then the user 'regression.test.core@toponify.com' should be a member of team 'Automated Regression Test Team (DO NOT DELETE)'
