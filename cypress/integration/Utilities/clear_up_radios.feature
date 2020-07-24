@utilities
Feature: Utilities
  Various Utilities to clear up components

  Scenario: Delete Radios
    Given a valid user is logged in
    And the user selects Radios menu item
    And the radio '' does not exist

