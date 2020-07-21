Feature: Work Package Edit Objectives Feature
As a user, I want to be able to modify the objectives of work packages and save the changes

Background:
    Given a valid user is logged in
    And the user selects Work Package menu item
    And the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'

  @objectives @work_package
  Scenario: Add a work package objective and confirm
    Given the 'Work Package' 'Objectives' pane is open
    When the user adds an objective to the work package 'Created Automated Regression Test Work Package' and gives it the name 'Test Objective' with description 'This is a test objective'
    And the user clicks to 'confirm' the create of the objective
    Then the work package objective tables should contain the objective called 'Test Objective'

  @objectives @work_package
  Scenario: Add a work package objective and cancel
    Given the 'Work Package' 'Objectives' pane is open
    When the user adds an objective to the work package 'Created Automated Regression Test Work Package' and gives it the name 'Test Objective' with description 'This is a test objective'
    And the user clicks to 'cancel' the create of the objective
    Then the work package objective tables should not contain the objective called 'Test Objective'

  @objectives @work_package @known_failure @TOP-861
  Scenario: Move a work package objective and confirm
    Given the user has created and selected a work package called 'Automated Regression Test Second Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the 'Created Automated Regression Test Work Package' is selected
    And the 'Work Package' 'Objectives' pane is open
    When the user adds an objective to the work package 'Created Automated Regression Test Work Package' and gives it the name 'Test Objective' with description 'This is a test objective'
    And the user clicks to 'confirm' the create of the objective
    And the user moves the 'Test Objective' objective to the work package 'Automated Regression Test Second Work Package'
    And the user clicks to 'confirm' the move of the objective
    Then the work package objective tables should not contain the objective called 'Test Objective'
    And the 'Automated Regression Test Second Work Package' is selected
    Then the work package objective tables should contain the objective called 'Test Objective'

  @objectives @work_package @known_failure @TOP-861
  Scenario: Move a work package objective and cancel
    Given the user has created and selected a work package called 'Automated Regression Test Second Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the 'Created Automated Regression Test Work Package' is selected
    And the 'Work Package' 'Objectives' pane is open
    When the user adds an objective to the work package 'Created Automated Regression Test Work Package' and gives it the name 'Test Objective' with description 'This is a test objective'
    And the user clicks to 'confirm' the create of the objective
    And the user moves the 'Test Objective' objective to the work package 'Automated Regression Test Second Work Package'
    And the user clicks to 'cancel' the move of the objective
    Then the work package objective tables should contain the objective called 'Test Objective'
    And the 'Automated Regression Test Second Work Package' is selected
    Then the work package objective tables should not contain the objective called 'Test Objective'

  @objectives @work_package
  Scenario: Delete a work package objective and cancel
    Given the user has created and selected a work package called 'Automated Regression Test Second Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the 'Created Automated Regression Test Work Package' is selected
    And the 'Work Package' 'Objectives' pane is open
    When the user adds an objective to the work package 'Created Automated Regression Test Work Package' and gives it the name 'Test Objective' with description 'This is a test objective'
    And the user clicks to 'confirm' the create of the objective
    And the user deletes the 'Test Objective' objective
    And the user clicks to 'cancel' the delete of the objective
    Then the work package objective tables should contain the objective called 'Test Objective'

  @objectives @work_package
  Scenario: Delete a work package objective and confirm
    Given the user has created and selected a work package called 'Automated Regression Test Second Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the 'Created Automated Regression Test Work Package' is selected
    And the 'Work Package' 'Objectives' pane is open
    When the user adds an objective to the work package 'Created Automated Regression Test Work Package' and gives it the name 'Test Objective' with description 'This is a test objective'
    And the user clicks to 'confirm' the create of the objective
    And the user deletes the 'Test Objective' objective
    And the user clicks to 'confirm' the delete of the objective
    Then the work package objective tables should not contain the objective called 'Test Objective'
