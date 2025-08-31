Feature: Notes Completion and Status Management
  As an authenticated user
  I want to mark notes as completed or pending
  So that I can track my task progress

  Background:
    Given the Notes API is available at "https://practice.expandtesting.com/notes/api"
    And I am logged in as a valid user

  @completion
  Scenario: Mark a note as completed
    Given I have created a pending note
    When I mark the note as completed
    Then the note status should be updated to completed
    And the completion timestamp should be set

  @completion
  Scenario: Mark a completed note as pending
    Given I have a completed note
    When I mark the note as pending
    Then the note status should be updated to pending
    And the completion timestamp should be cleared

  @completion
  Scenario: Toggle note completion status
    Given I have a note with current status
    When I toggle the completion status
    Then the status should be reversed
    And the appropriate timestamps should be updated
    