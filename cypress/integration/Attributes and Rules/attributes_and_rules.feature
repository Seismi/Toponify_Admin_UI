@attributes_and_rules
Feature: Attributes and Rules CRUD
  As a user, I want to ADD, DELETE, UPDATE and CREATE attributes or rules

  Background:
    Given a valid user is logged in
    When the user selects Work Package menu item
    And the work package 'Created Automated Regression Test Work Package' does not exist
    And the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    When the user selects Attributes and Rules menu item
    And the work package 'Created Automated Regression Test Work Package' is editable on the 'Attributes And Rules' menu
    And the attribute or rule 'Automated Regression Test Attribute' does not exist in the table

  @attributes_and_rules
  Scenario: Create attribute and cancel
    When the user creates a new 'attribute' called 'Automated Regression Test Attribute' with description 'Automated Regression Test Attribute Description' and cancels
    Then the 'attribute' called 'Automated Regression Test Attribute' should not exist in the attributes and rules table immediately

  @attributes_and_rules
  Scenario: Create attribute and confirm
    When the user creates a new 'attribute' called 'Automated Regression Test Attribute' with description 'Automated Regression Test Attribute Description'
    Then the 'attribute' called 'Automated Regression Test Attribute' should exist in the attributes and rules table immediately

  @attributes_and_rules
  Scenario: Update attribute and cancel
    When the user creates a new 'attribute' called 'Automated Regression Test Attribute' with description 'Automated Regression Test Attribute Description'
    Then the 'attribute' called 'Automated Regression Test Attribute' should exist in the attributes and rules table immediately
    And the user updates category 'rule', title 'Automated Regression Test Rule', description 'Automated Regression Test Rule Description'
    And the user cancel update
    Then the attribute or rule 'Automated Regression Test Attribute' does not exist in the table

  @attributes_and_rules
  Scenario: Update attribute and confirm
    When the user creates a new 'attribute' called 'Automated Regression Test Attribute' with description 'Automated Regression Test Attribute Description'
    Then the 'attribute' called 'Automated Regression Test Attribute' should exist in the attributes and rules table immediately
    And the user updates category 'rule', title 'Automated Regression Test Rule', description 'Automated Regression Test Rule Description'
    And the user confirm update
    Then the attribute 'Automated Regression Test Rule' should exist in the table

  @attributes_and_rules
  Scenario: Delete attribute and cancel
    When the user creates a new 'attribute' called 'Automated Regression Test Attribute' with description 'Automated Regression Test Attribute Description'
    Then the 'attribute' called 'Automated Regression Test Attribute' should exist in the attributes and rules table immediately
    And the user deletes the attribute and cancel
    Then the attribute 'Automated Regression Test Rule' should exist in the table

  @attributes_and_rules
  Scenario: Delete attribute and confirm
    When the user creates a new 'attribute' called 'Automated Regression Test Attribute' with description 'Automated Regression Test Attribute Description'
    Then the 'attribute' called 'Automated Regression Test Attribute' should exist in the attributes and rules table immediately
    And the user deletes the attribute and confirm
    Then the attribute or rule 'Automated Regression Test Attribute' does not exist in the table