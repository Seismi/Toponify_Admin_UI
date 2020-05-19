Feature:Main Menu
          As a user, I want to be able to select Topology from the menu
  Background:
    Given a valid user is logged in

  Scenario: Topology Menu Select
    When the user selects Topology menu item
    Then toponify should display the Topology page
    And the menu should not be visible

  Scenario: Reports Menu Select
    When the user selects Reports menu item
    Then toponify should display the Reports page
    And the menu should not be visible

  Scenario: Attributes and Rules Menu Select
    When the user selects Attributes and Rules menu item
    Then toponify should display the Attributes and Rules page
    And the menu should not be visible

  Scenario: Work Packages Menu Select
    When the user selects Work Package menu item
    Then toponify should display the Work Package page
    And the menu should not be visible

  Scenario: Radios Menu Select
    When the user selects Radios menu item
    Then toponify should display the Radios page
    And the menu should not be visible

  Scenario: Scopes and Layouts Menu Select
    When the user selects Scopes and Layouts menu item
    Then toponify should display the Scopes and Layouts page
    And the menu should not be visible

  Scenario: Documentation Standard Menu Select
    When the user selects Documentation Standard menu item
    Then toponify should display the Documentation Standard page
    And the menu should not be visible

  Scenario: My Profile Menu Select
    When the user selects My Profile menu item
    Then toponify should display the My Profile page
    And the menu should not be visible

  Scenario: Settings Menu Select
    When the user selects Settings menu item
    Then toponify should display the Settings page
    And the menu should not be visible

  Scenario: Logout Menu Select
    Then toponify should display the Logout page
    And the menu should not be visible
