Feature: Notes Management - Create and Read
  As an authenticated user
  I want to update notes
  So that I can manage my personal information

  Background:
    Given the Notes API is available
    And a user is logged in with valid credentials

  @crud
  Scenario: Successfully update an existing note
    Given the user has an existing note
    When a request is made to update the note with new valid information
    Then the response status code should be 200
    And the response should contain the updated note information
    And the note's last updated timestamp should be changed

  @crud
  Scenario: Partially update a note using PATCH
    Given the user has an existing note with a specific title and description
    When a PATCH request is made to update only the title field
    Then the response status code should be 200
    And the note's title should be updated to the new value
    And the note's description should remain unchanged from its original value

  @crud @negative
  Scenario: Attempt to update a note that does not exist
    Given a note ID that does not exist in the system is provided
    When a request is made to update the note
    Then the response status code should be 400
    And the error message should indicate the note has invalid id

  @crud @negative
  Scenario: Attempt to update a note with invalid data
    Given the user has an existing note
    When a request is made to update the note with invalid or malformed data
    Then the response status code should be 400
    And the response should contain a validation error
    And the note's data should remain unchanged
