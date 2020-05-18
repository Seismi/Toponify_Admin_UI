Feature: login
          As a user, I want to be able to login
  Scenario: Successful Login
    Given I am on the login page
    When  I ask to log in as usertype 'validuser'
    Then toponify should display the 'Home' page

  Scenario: Login Failure
    Given I am on the login page
    When I ask to log in as usertype 'invaliduser'
    Then 'auth-login-error-msg' should read 'Invalid user/password'
