@core
Feature: Work Package Create Feature
  As a user, I want to be able to be able to create work packages

  Background:
    Given a valid user is logged in
    And the user selects Work Package menu item
    And the work package 'Automated Regression Test Work Package' does not exist

  Scenario: Create a work package in the work packages but cancel
    When the user clicks the create work package button in the work packages table
    And the user creates a work package called 'Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the user cancels the work package create
    Then the create package pop-up should close
    And the work package 'Automated Regression Test Work Package' should not be created

  Scenario: Create a work package in the work packages and save
    When the user clicks the create work package button in the work packages table
    And the user creates a work package called 'Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the user saves the work package
    Then the create package pop-up should close
    And the work package 'Automated Regression Test Work Package' should be created

  Scenario: Create a work package in the details pane but cancel
    When the user clicks the create work package button in the work packages details pane
    And the user creates a work package called 'Automated Regression Test Work Package', with a description 'Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the user cancels the work package create
    Then the create package pop-up should close
    And the work package 'Automated Regression Test Work Package' should not be created

  Scenario: Create a work package in the details pane and save
    When the user clicks the create work package button in the work packages details pane
    And the user creates a work package called 'Automated Regression Test Work Package', with a description 'Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the user saves the work package
    Then the create package pop-up should close
    And the work package 'Automated Regression Test Work Package' should be created
