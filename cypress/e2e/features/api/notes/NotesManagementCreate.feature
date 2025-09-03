Feature: Notes Management - Create and Read
  As an authenticated user
  I want to create notes
  So that I can manage my personal information

  Background:
    Given the Notes API is available
    And a user is logged in with valid credentials

  @crud @smoke
  Scenario: Create a new note with valid data
    Given the user has valid note data
    When the user creates a new note
    Then the response status code should be 200
    And the response should include the note ID
    And the note should contain the provided title and description
    And the note should have a creation timestamp

  @crud @negative
  Scenario: Create a note with only title
    Given the user has note data with only a title
    When the user creates a new note
    Then the response status code should be 400
    And the error should specify missing description field

  @crud @negative
  Scenario: Create a note without required fields
    Given the user has incomplete note data
    When the user attempts to create a new note
    Then the response status code should be 400
    And the error should specify missing title field
