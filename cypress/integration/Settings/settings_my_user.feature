
Feature: Edit my details
  As a user, I want to be able to edit my details

  Background:
    Given a valid user is logged in
    And the user selects Settings menu item
    Given the 'Settings' 'All Users' tab is selected
    And the user with email address 'regression.test.core@toponify.com' exists with first name 'Automated (DO NOT DELETE)', last name 'Regression-Test', phone number '01234567890', team 'Automated Regression Test Team (DO NOT DELETE)' and role 'Administrator'


  Scenario: Edit my details
    Given the 'Settings' 'My User' tab is selected
    When my user is updated with first name 'Automated Updated (DO NOT DELETE)', last name 'Regression-Updated-Test', phone number '09876543210', team 'Automated Regression Test Update Team (DO NOT DELETE)' and role 'Architect'
    Then my user should have first name 'Automated Updated (DO NOT DELETE)', last name 'Regression-Updated-Test', phone number '09876543210', team 'Automated Regression Test Update Team (DO NOT DELETE)' and role 'Architect'




