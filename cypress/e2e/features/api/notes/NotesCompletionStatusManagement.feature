Feature: Notes Completion and Status Management
  As an authenticated user
  I want to mark notes as completed or pending
  So that I can track my task progress

  Background:
    Given the Notes API is available
    And I am logged in as a valid user

  @completion
  Scenario: Mark a note as completed
    Given a valid user is authenticated
    And the user has an existing note with a "pending" status
    When a request is made to update the note's status to "completed"
    Then the response status should be 200 (OK)
    And the note's status should be "completed"
    And the note's completion timestamp should be set to the current time

  @completion
  Scenario: Mark a completed note as pending
    Given a valid user is authenticated
    And the user has an existing note with a "completed" status
    When a request is made to update the note's status to "pending"
    Then the response status should be 200 (OK)
    And the note's status should be "pending"
    And the note's completion timestamp should be cleared (set to null)

  @completion
  Scenario: Toggle note completion status
    Given a valid user is authenticated
    And the user has an existing note with a known status
    When a request is made to toggle the note's completion status
    Then the response status should be 200 (OK)
    And the note's status should be the opposite of its previous state
    And if the new status is "completed", the completion timestamp should be set
    And if the new status is "pending", the completion timestamp should be cleared
