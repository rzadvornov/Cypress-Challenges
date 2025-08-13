Feature: Error Handling
  As a customer
  I want to see helpful error messages
  So that I understand what went wrong and how to fix it

  Scenario: Page not found
    Given the user navigates to a non-existent page
    And the user should see a 404 error page
    When the user clicks on return to the homepage button
    Then the user should be returned to homepage

