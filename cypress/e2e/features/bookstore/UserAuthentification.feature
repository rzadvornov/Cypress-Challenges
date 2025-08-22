Feature: User Authentication
  As a customer
  I want to create an account and log in
  So that I can save my preferences and order history

  Background:
    Given the user is on the bookstore Homepage
    And the bookstore Homepage has loaded completely

  Scenario: User registration
    When the user clicks on 'Sign In' button at 'Bookstore Home' page
    Then the 'Sign In' page should be loaded
    When the user clicks on 'Sign Up' button at 'Sign In' page
    Then the 'Sign Up' page should be loaded
    And the user fills the registration form with valid details:
      | Field            | Value          |
      | User Name        | [random]       |
      | Email            | [random]       |
      | Password         | SecurePass123! |
      | Confirm Password | SecurePass123! |
    And the user clicks on 'Sign Up' button at 'Sign Up' page
    Then the user should be logged in
    And the user should be redirected to bookstore Homepage

  Scenario: User login/logout with valid credentials
    Given the user has registered account
    And the user is logged out
    When the user clicks on 'Sign In' button at 'Bookstore Home' page
    Then the 'Sign In' page should be loaded
    And the user enters his email
    And the user enters his password
    And the user clicks 'Sign In' button at 'Sign In' page
    Then the user should be logged in
    And the user should see his account dashboard
    And the user is logged out
    And the user is on the bookstore Homepage
    And the bookstore Homepage has loaded completely

  Scenario: User login with invalid credentials
    Given the user has registered account
    And the user is logged out
    When the user clicks on 'Sign In' button at 'Bookstore Home' page
    Then the 'Sign In' page should be loaded
    And the user enters email "invalid@example.com"
    And the user enters password "wrongpassword"
    And the user clicks 'Sign In' button at 'Sign In' page
    Then the user should see an error message indicating user absense
    And the user should remain on the 'Sign In' page
