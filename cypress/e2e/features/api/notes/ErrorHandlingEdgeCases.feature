Feature: API Error Handling and Edge Cases
  As a developer using the Notes API
  I want proper error handling
  So that I can handle failures gracefully

  Background:
    Given the Notes API is available

  @negative @security
  Scenario: Unauthenticated user cannot retrieve notes
    Given no user is authenticated
    When a request is made to retrieve notes
    Then the response status code should be 401
    And the response body should indicate an authentication error

  @negative @security
  Scenario: User cannot access another user's notes
    Given a valid user "A" is authenticated
    And a different user "B" has existing notes
    When a request is made to retrieve notes for user "B"
    Then the response status code should be 200
    And the response must not contain any notes of user "B"

  @negative
  Scenario: System rejects a malformed request
    Given a user is logged in with valid credentials
    When a request with malformed JSON is sent
    Then the response status code should be 400
    And the response should indicate an invalid request format

  @negative
  Scenario: System rejects a note with extremely long content
    Given a user is logged in with valid credentials
    When a request is made to create a note with content exceeding the limit
    Then the response status code should be 400
    And the response should contain a validation error

  @performance
  Scenario: System handles bulk creation operations performantly
    Given a user is logged in with valid credentials
    When multiple notes are created in sequence
    Then all create operations should respond with 200
    And the response times should remain within acceptable performance limits
