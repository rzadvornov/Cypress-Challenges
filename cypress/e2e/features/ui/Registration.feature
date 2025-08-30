Feature: User Registration
  As a user
  I want to register for an account
  So that I can access the platform with proper data validation

  Background:
    Given the user is on the Registration page
    And the registration form is displayed

  Scenario: Successful registration with valid data
    Given the user enters a valid generated username
    And the user enters a valid password 'Password123!'
    And the user confirms the password 'Password123!'
    When the user clicks the 'Register' button
    Then the user should see 'Successfully registered, you can log in now.' message
    And I should be redirected to the 'Login' page

  Scenario: Registration fails with empty username
    Given the user leaves empty the username field
    And the user enters a valid password 'Password123!'
    And the user confirms the password 'Password123!'
    When the user clicks the 'Register' button
    Then the user should see 'All fields are required.' error message
    And the user should remain on the Registration page

  Scenario: Registration fails with weak password
    Given the user enters a valid generated username
    And the user enters a valid password '123'
    And the user confirms the password '123'
    When the user clicks the 'Register' button
    Then the user should see 'Password must be at least 4 characters long.' error message
    And the user should remain on the Registration page

  Scenario: Registration fails with mismatched password confirmation
    Given the user enters a valid generated username
    And the user enters a valid password 'Password123!'
    And the user confirms the password 'DifferentPassword123!'
    When the user clicks the 'Register' button
    Then the user should see 'Passwords do not match.' error message
    And the user should remain on the Registration page

  Scenario: Registration fails with existing username
    Given the user enters a valid existing username 'practice'
    And the user enters a valid password 'Password123!'
    And the user confirms the password 'Password123!'
    When the user clicks the 'Register' button
    Then the user should see 'Username is already taken.' error message
    And the user should remain on the Registration page

  Scenario: Registration fails with weak username
    Given the user enters a invalid username 'un'
    And the user enters a valid password 'Password123!'
    And the user confirms the password 'Password123!'
    When the user clicks the 'Register' button
    Then the user should see 'Username must be at least 3 characters long.' error message
    And the user should remain on the Registration page
