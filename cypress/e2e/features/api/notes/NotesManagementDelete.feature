Feature: Notes Management - Create and Read
  As an authenticated user
  I want to delete notes
  So that I can manage my personal information

  Background:
    Given the Notes API is available
    And a user is logged in with valid credentials

  @crud
  Scenario: Delete an existing note
    Given the user has an existing note
    When a request is made to delete the note
    Then the response status should be 200 or 204
    And the note should no longer exist in the system

  @crud @negative
  Scenario: Delete a non-existent note
    Given a note ID that does not exist in the system is provided
    When a request is made to delete the unexistent note
    Then the user should receive a bad request error
    And the error message should indicate the note has invalid id

  @crud
  Scenario: Delete a note and verify it's removed from list
    Given the user has multiple existing notes
    When a request is made to delete one specific note
    Then the deleted note should not appear in the notes list
    And all other notes should remain intact in the list
