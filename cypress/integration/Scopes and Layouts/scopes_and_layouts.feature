@core
Feature: Scopes and Layouts
  As a user, I want to be manage scopes and layouts

  Background:
    Given a valid user is logged in
    And the user selects Scopes and Layouts menu item
    And the scope called 'Automated Regression Test Scope' does not exist
    And the scope called 'Automated Updated Regression Test Scope' does not exist

  @ScopesAndLayouts
  Scenario:  Creates a scope and check it appears in table and topology dropdown
    When the user creates a new scope called 'Automated Regression Test Scope'
    Then the scope called 'Automated Regression Test Scope' should appear in the scopes table with filtering component 'system'
    And the user selects Topology menu item
    And the scopes header drop down should contain 'Automated Regression Test Scope'
    And the user selects Scopes and Layouts menu item
    And the user reloads the scopes and layouts page
    And the scope called 'Automated Regression Test Scope' should appear in the scopes table with filtering component 'system'
    And the user selects Topology menu item
    And the scopes header drop down should contain 'Automated Regression Test Scope'

  @ScopesAndLayouts
  Scenario:  Creates a layout and check it appears in table and topology dropdown
    Given the user creates a new scope called 'Automated Regression Test Scope'
    And the user selects the scope called 'Automated Regression Test Scope'
    When the user creates a new layout called 'Automated Regression Test Scope Layout' against the scope called 'Automated Regression Test Scope'
    Then the layouts table should contain 'Automated Regression Test Scope Layout' against the scope called 'Automated Regression Test Scope'
    And the user selects Topology menu item
    And the layouts canvas drop down should contain 'Automated Regression Test Scope Layout' against scope 'Automated Regression Test Scope'
    And the user selects Scopes and Layouts menu item
    And the user reloads the scopes and layouts page
    And the user selects Topology menu item
    And the layouts canvas drop down should contain 'Automated Regression Test Scope Layout' against scope 'Automated Regression Test Scope'

  @ScopesAndLayouts
  Scenario:  Update a scope and check it appears in table and topology dropdown
    And the user creates a new scope called 'Automated Regression Test Scope'
    When the user updates the scope called 'Automated Regression Test Scope' to have name 'Automated Updated Regression Test Scope' and filtering components 'data'
    Then the scope called 'Automated Updated Regression Test Scope' should appear in the scopes table with filtering component 'data'

  @ScopesAndLayouts
  Scenario:  Update a Layout and check it appears in table and topology dropdown
    Given the user creates a new scope called 'Automated Regression Test Scope'
    And the user selects the scope called 'Automated Regression Test Scope'
    And the user creates a new layout called 'Automated Regression Test Scope Layout' against the scope called 'Automated Regression Test Scope'
    When the user updates the layout called 'Automated Regression Test Scope Layout' to be 'Automated Updated Regression Test Scope Layout' against the scope called 'Automated Regression Test Scope'
    Then the layouts table should contain 'Automated Updated Regression Test Scope Layout' against the scope called 'Automated Regression Test Scope'
    And the user selects Topology menu item
    And the layouts canvas drop down should contain 'Automated Updated Regression Test Scope Layout' against scope 'Automated Regression Test Scope'
    And the user selects Scopes and Layouts menu item
    Then the layouts table should contain 'Automated Updated Regression Test Scope Layout' against the scope called 'Automated Regression Test Scope'
    And the user reloads the scopes and layouts page
    And the user selects Topology menu item
    And the layouts canvas drop down should contain 'Automated Updated Regression Test Scope Layout' against scope 'Automated Regression Test Scope'

  @ScopesAndLayouts
  Scenario:  Delete a Layout from a scope and check it disappears from the table and topology dropdown
    Given the user creates a new scope called 'Automated Regression Test Scope'
    And the user selects the scope called 'Automated Regression Test Scope'
    And the user creates a new layout called 'Automated Regression Test Scope Layout' against the scope called 'Automated Regression Test Scope'
    When the user deletes the layout called 'Automated Regression Test Scope Layout' against the scope called 'Automated Regression Test Scope'
    Then the layouts table should not contain 'Automated Updated Regression Test Scope Layout' against the scope called 'Automated Regression Test Scope'
    And the user selects Topology menu item
    And the layouts canvas drop down should not contain 'Automated Updated Regression Test Scope Layout' against scope 'Automated Regression Test Scope'
    And the user reloads the scopes and layouts page
    And the user selects Scopes and Layouts menu item
    And the layouts table should not contain 'Automated Updated Regression Test Scope Layout' against the scope called 'Automated Regression Test Scope'
    And the user selects Topology menu item
    And the layouts canvas drop down should not contain 'Automated Updated Regression Test Scope Layout' against scope 'Automated Regression Test Scope'

  @ScopesAndLayouts
  Scenario:  Delete a scope and check it disappears from the table and topology dropdown
    Given the user creates a new scope called 'Automated Regression Test Scope'
    When the scope called 'Automated Regression Test Scope' is deleted
    Then the scope called 'Automated Regression Test Scope' should not appear in the scopes table
    And the user selects Topology menu item
    And the scopes header drop down should not contain 'Automated Regression Test Scope'
    And the user selects Scopes and Layouts menu item
    And the user reloads the scopes and layouts page
    And the scope called 'Automated Regression Test Scope' should not appear in the scopes table
    And the user selects Topology menu item
    And the scopes header drop down should not contain 'Automated Regression Test Scope'
