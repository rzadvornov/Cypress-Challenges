Feature: Notes Management - Create and Read
  As an authenticated user
  I want to delete notes
  So that I can manage my personal information

  Background:
    Given the Notes API is available
    And a user is logged in with valid credentials

  @crud
  Scenario: Delete an existing note
    Given I have created a note
    When I delete the note
    Then I should receive a successful deletion response
    And the note should no longer exist in the system

  @crud @negative
  Scenario: Delete a non-existent note
    Given I have a non-existent note ID
    When I attempt to delete the note
    Then I should receive a not found error

  @crud
  Scenario: Delete a note and verify it's removed from list
    Given I have created multiple notes
    When I delete one specific note
    Then the note should be removed from my notes list
    And other notes should remain intact
