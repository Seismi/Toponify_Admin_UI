@core
Feature: Work Package Edit Documentation Standards Feature
  As a user, I want to be able to modify the core details of work packages and save the changes

  Background:
    Given a valid user is logged in
    And the user selects Work Package menu item
    And the work package 'Automated Regression Test Work Package' does not exist
    And the user has created and selected a work package called 'Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the user selects Documentation Standard menu item

# NUMBER TESTS
  Scenario: Check that entering an invalid value into a number type documentation standard will not save
    Given the documentation standard 'Regression Test Documentation Standard Number' exists with type 'Number' against 'Work Package' component
    And the user confirms the creation of the documentation standard
    And the user selects Work Package menu item
    And the 'Automated Regression Test Work Package' is selected
    And the 'Work Package' 'Documentation Standards' pane is open
    When the user enters string 'this is some text' into field 'Regression Test Documentation Standard Number'
    And the user clicks to 'save' the invalid change
    Then the 'Regression Test Documentation Standard Number' should display the error message 'Not valid! Please make sure that your value matches property type'

  #NOTE: THis test will fail as the number type only accepts integers at present
  Scenario: Check that entering a valid float into a number type documentation standard will save (known failure at present)
    Given the documentation standard 'Regression Test Documentation Standard Number' exists with type 'Number' against 'Work Package' component
    And the user confirms the creation of the documentation standard
    And the user selects Work Package menu item
    And the 'Automated Regression Test Work Package' is selected
    And the 'Work Package' 'Documentation Standards' pane is open
    When the user enters number 12314.14 into field "Regression Test Documentation Standard Number"
    And the user clicks to "save" the valid change
    Then the value of 'Regression Test Documentation Standard Number' should be 12314.14

  Scenario: Check that entering a valid integer into a number type documentation standard will save
    Given the documentation standard 'Regression Test Documentation Standard Number' exists with type 'Number' against 'Work Package' component
    And the user confirms the creation of the documentation standard
    And the user selects Work Package menu item
    And the 'Automated Regression Test Work Package' is selected
    And the 'Work Package' 'Documentation Standards' pane is open
    When the user enters number 12314 into field "Regression Test Documentation Standard Number"
    And the user clicks to "save" the valid change
    Then the value of 'Regression Test Documentation Standard Number' should be 12314

#DATE TESTS
  Scenario: Check that entering an invalid value into a date type documentation standard will not save
    Given the documentation standard 'Regression Test Documentation Standard Date' exists with type 'Date' against 'Work Package' component
    And the user confirms the creation of the documentation standard
    And the user selects Work Package menu item
    And the 'Automated Regression Test Work Package' is selected
    And the 'Work Package' 'Documentation Standards' pane is open
    When the user enters date 30/02/2012 into field 'Regression Test Documentation Standard Date'
    And the user clicks to "save" the invalid change
    Then the 'Regression Test Documentation Standard Date' should display the error message 'Not valid! Please make sure that your value matches property type'

  Scenario: Check that entering a valid value into a date type documentation standard will save
    Given the documentation standard 'Regression Test Documentation Standard Date' exists with type 'Date' against 'Work Package' component
    And the user confirms the creation of the documentation standard
    And the user selects Work Package menu item
    And the 'Automated Regression Test Work Package' is selected
    And the 'Work Package' 'Documentation Standards' pane is open
    When the user enters date 01/01/2020 into field 'Regression Test Documentation Standard Date'
    And the user clicks to 'save' the valid change
    Then the value of 'Regression Test Documentation Standard Date' should be Jan 1, 2020

#URL TESTS
  Scenario: Check that entering an invalid value into a URL type documentation standard will not save
    Given the documentation standard 'Regression Test Documentation Standard URL' exists with type 'Hyperlink' against 'Work Package' component
    And the user confirms the creation of the documentation standard
    And the user selects Work Package menu item
    And the 'Automated Regression Test Work Package' is selected
    And the 'Work Package' 'Documentation Standards' pane is open
    When the user enters string 'this is some text' into field 'Regression Test Documentation Standard URL'
    And the user clicks to 'save' the invalid change
    Then the 'Regression Test Documentation Standard URL' should display the error message 'Not valid! Please make sure that your value matches property type'

  Scenario: Check that entering a valid value into a URL type documentation standard will not save
    Given the documentation standard 'Regression Test Documentation Standard URL' exists with type 'Hyperlink' against 'Work Package' component
    And the user confirms the creation of the documentation standard
    And the user selects Work Package menu item
    And the 'Automated Regression Test Work Package' is selected
    And the 'Work Package' 'Documentation Standards' pane is open
    When the user enters string 'https://www.seismi.net' into field 'Regression Test Documentation Standard URL'
    And the user clicks to 'save' the valid change
    Then the value of 'Regression Test Documentation Standard URL' should be 'https://www.seismi.net'

#BOOLEAN TESTS
  Scenario: Check that entering a valid value into a boolean type documentation standard will save
    Given the documentation standard 'Regression Test Documentation Standard Boolean' exists with type 'Boolean' against 'Work Package' component
    And the user confirms the creation of the documentation standard
    And the user selects Work Package menu item
    And the 'Automated Regression Test Work Package' is selected
    And the 'Work Package' 'Documentation Standards' pane is open
    When the user enters boolean true into field 'Regression Test Documentation Standard Boolean'
    And the user clicks to 'save' the valid change
    And the value of 'Regression Test Documentation Standard Boolean' should be true

#STRING TEST
  Scenario: Check that entering a valid string into a string type documentation standard will save
    Given the documentation standard 'Regression Test Documentation Standard String' exists with type 'Text' against 'Work Package' component
    And the user confirms the creation of the documentation standard
    And the user selects Work Package menu item
    And the 'Automated Regression Test Work Package' is selected
    And the 'Work Package' 'Documentation Standards' pane is open
    When the user enters string 'This is some text' into field "Regression Test Documentation Standard String"
    And the user clicks to 'save' the valid change
    Then the value of 'Regression Test Documentation Standard String' should be 'This is some text'

