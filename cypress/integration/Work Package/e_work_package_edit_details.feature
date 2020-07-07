@core
Feature: Work Package Edit Core Details Feature
  As a user, I want to be able to modify the core details of work packages and save the changes

  Background:
    Given a valid user is logged in
    And the user selects Work Package menu item
    And the work package 'Created Automated Regression Test Work Package' does not exist
    And the work package 'Automated Updated Regression Test Work Package' does not exist
    And the work package 'Automated Regression Test Second Work Package' does not exist

  @work_package
  Scenario: Edit the work package name and description and cancel
    Given the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the "Work Package" "Details" pane is open
    When the user updates the work package name to 'Updated Automated Regression Test Work Package' and description to 'Automated Regression Test Work Package Description (Updated)'
    And the user cancels the work package changes
    And the user reloads the page and searches for 'Created Automated Regression Test Work Package' work package
    Then the details pane should reflect the new work package name 'Created Automated Regression Test Work Package' and description 'Automated Regression Test Work Package Description'

  @work_package
  Scenario: Edit the work package name and description and save
    Given the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the "Work Package" "Details" pane is open
    When the user updates the work package name to 'Automated Updated Regression Test Work Package' and description to 'Updated Automated Regression Test Work Package Description'
    And the user saves the work package changes
    And the user reloads the page and searches for 'Automated Updated Regression Test Work Package' work package
    Then the details pane should reflect the new work package name 'Automated Updated Regression Test Work Package' and description 'Updated Automated Regression Test Work Package Description'

  @work_package
  Scenario: Add a work package to baseline and cancel
    Given the user has created and selected a work package called 'Automated Regression Test Second Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the "Work Package" "Details" pane is open
    When the user adds work package 'Automated Regression Test Second Work Package' to baseline of work package 'Created Automated Regression Test Work Package' and clicks to 'cancel'
    Then the details pane should reflect that 'Automated Regression Test Second Work Package' has not been added to baseline of work package 'Created Automated Regression Test Work Package'

  @work_package
  Scenario: Add a work package to baseline and confirm
    Given the user has created and selected a work package called 'Automated Regression Test Second Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the "Work Package" "Details" pane is open
    When the user adds work package 'Automated Regression Test Second Work Package' to baseline of work package 'Created Automated Regression Test Work Package' and clicks to 'confirm'
    Then the details pane should reflect that 'Automated Regression Test Second Work Package' has been added to baseline of work package 'Created Automated Regression Test Work Package'

  @work_package
  Scenario: Remove a work package from baseline and cancel
    Given the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the user has created and selected a work package called 'Automated Regression Test Second Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the user selects the work package 'Created Automated Regression Test Work Package'
    And the "Work Package" "Details" pane is open
    When the user adds work package 'Automated Regression Test Second Work Package' to baseline of work package 'Created Automated Regression Test Work Package' and clicks to 'confirm'
    And the user removes work package 'Automated Regression Test Second Work Package' from baseline of work package 'Created Automated Regression Test Work Package' and clicks to 'confirm'
    Then the details pane should reflect that 'Automated Regression Test Second Work Package' has not been added to baseline of work package 'Created Automated Regression Test Work Package'

  @work_package
  Scenario: Edit the work package owner and cancel
    Given the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the "Work Package" "Details" pane is open
    When the user adds owner 'Automated Regression Test Update Team (DO NOT DELETE)' to owners of work package 'Created Automated Regression Test Work Package' and clicks to 'cancel'
    Then the details pane should reflect that 'Automated Regression Test Update Team (DO NOT DELETE)' has not been added as an owner of work package 'Created Automated Regression Test Work Package'

  @work_package
  Scenario: Edit the work package owner and confirm
    Given the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the "Work Package" "Details" pane is open
    When the user adds owner 'Automated Regression Test Update Team (DO NOT DELETE)' to owners of work package 'Created Automated Regression Test Work Package' and clicks to 'confirm'
    Then the details pane should reflect that 'Automated Regression Test Update Team (DO NOT DELETE)' has been added as an owner of work package 'Created Automated Regression Test Work Package'

  @work_package @workflow
  Scenario: Submit the work package
    Given the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the "Work Package" "Details" pane is open
    When the user clicks the 'submit' button on the work package
    And the user reloads the page and searches for 'Created Automated Regression Test Work Package' work package
    Then the work package status should change to 'submitted'
    And the visible buttons in the detail pane should change to be 'Approve,Reject,Reset,Supersede,Archive'

#  Scenario: Submit the work package without an approver
#    Given the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
#    When the user clicks the 'submit' button on the work package
#    And the user reloads the page and searches for 'Created Automated Regression Test Work Package' work package
#    Then the work package status should change to 'submitted'
#    And the visible buttons in the detail pane should change to be 'Approve,Reject,Reset,Supersede,Archive'
  @work_package @workflow
  Scenario: Submit and Reset the work package
    Given the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the "Work Package" "Details" pane is open
    When the user clicks the 'submit' button on the work package
    And the user clicks the 'reset' button on the work package
    And the user reloads the page and searches for 'Created Automated Regression Test Work Package' work package
    Then the work package status should change to 'draft'
    And the visible buttons in the detail pane should change to be 'Edit, Open, Submit, Supersede, Archive, Delete'

  @work_package @workflow
  Scenario: Submit and approve the work package
    Given the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the "Work Package" "Details" pane is open
    When the user clicks the 'submit' button on the work package
    And the user clicks the 'approve' button on the work package
    And the user reloads the page and searches for 'Created Automated Regression Test Work Package' work package
    Then the work package status should change to 'approved'
    And the visible buttons in the detail pane should change to be 'Open, Merge, Reset, Supersede, Archive'

  @work_package @workflow
  Scenario: Submit, approve and supersede the work package
    Given the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the "Work Package" "Details" pane is open
    When the user clicks the 'submit' button on the work package
    And the user clicks the 'approve' button on the work package
    And the user clicks the 'supersede' button on the work package
    And the user reloads the page and searches for 'Created Automated Regression Test Work Package' work package
    Then the work package status should change to 'superseded'
    And the visible buttons in the detail pane should change to be 'Archive, Delete'

  @work_package @workflow
  Scenario: Submit, approve and supersede, archive the work package
    Given the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the "Work Package" "Details" pane is open
    When the user clicks the 'submit' button on the work package
    And the user clicks the 'approve' button on the work package
    And the user clicks the 'supersede' button on the work package
    And the user clicks the 'archive' button on the work package
    Then the work package called 'Created Automated Regression Test Work Package' should not exist in the work packages table if archived unchecked

  @work_package @workflow
  Scenario: Submit, approve and supersede, archive and then unarchive the work package
    Given the user has created and selected a work package called 'Created Automated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the "Work Package" "Details" pane is open
    When the user clicks the 'submit' button on the work package
    And the user clicks the 'approve' button on the work package
    And the user clicks the 'supersede' button on the work package
    And the user clicks the 'archive' button on the work package
    And the user clicks the 'unarchive' button on the work package
    Then the work package called 'Created Automated Regression Test Work Package' should exist in the work packages table

  @work_package @workflow @focus
  Scenario: Delete a work package
    Given the user has created and selected a work package called 'Automated Updated Regression Test Work Package', with a description 'Automated Regression Test Work Package Description', baseline 'Current State' and owner 'Automated Regression Test Team (DO NOT DELETE)'
    And the "Work Package" "Details" pane is open
    When the user deletes the work package 'Automated Updated Regression Test Work Package'
    Then the work package called 'Automated Updated Regression Test Work Package' should not exist in the work packages table if archived checked
