Feature: API Error Handling and Edge Cases
  As a developer using the Notes API
  I want proper error handling
  So that I can handle failures gracefully

  Background:
    Given the Notes API is available at "https://practice.expandtesting.com/notes/api"

  @negative @security
  Scenario: Access notes without authentication
    Given I am not authenticated
    When I attempt to retrieve notes
    Then I should receive an unauthorized error
    And the error code should be 401

  @negative @security
  Scenario: Access another user's notes
    Given I am logged in as user A
    And another user B has created notes
    When I attempt to access user B's notes
    Then I should receive a forbidden error or empty result
    And I should not see user B's notes

  @negative
  Scenario: Handle malformed request data
    Given I am logged in as a valid user
    When I send a request with malformed JSON
    Then I should receive a bad request error
    And the error should indicate invalid request format

  @negative
  Scenario: Handle extremely long note content
    Given I am logged in as a valid user
    When I attempt to create a note with extremely long content
    Then I should receive appropriate validation response
    And the system should handle the request gracefully

  @performance
  Scenario: Handle bulk operations
    Given I am logged in as a valid user
    When I create multiple notes in sequence
    Then all operations should complete successfully
    And response times should be within acceptable limits
    