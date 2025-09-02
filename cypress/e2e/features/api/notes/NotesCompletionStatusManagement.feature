Feature: Notes Completion and Status Management
  As an authenticated user
  I want to mark notes as completed or pending
  So that I can track my task progress

  Background:
    Given the Notes API is available
    And a user is logged in with valid credentials

  @completion
  Scenario: Mark a note as completed
    Given the user has an existing note with a "pending" status
    When a request is made to update the note's status to "completed"
    Then the response status should be 200
    And the note's status should be "completed"
    And the note's updated_at timestamp should be set to the current time

  @completion
  Scenario: Mark a completed note as pending
    Given the user has an existing note with a "completed" status
    When a request is made to update the note's status to "pending"
    Then the response status should be 200
    And the note's status should be "pending"
    And the note's updated_at timestamp should be set to the current time

  @completion
  Scenario: Toggle note completion status
    Given the user has an existing note with a known status
    When a request is made to toggle the note's completion status
    Then the response status should be 200
    And the note's status should be the opposite of its previous state
    And the note's updated_at timestamp should be set to the current time
