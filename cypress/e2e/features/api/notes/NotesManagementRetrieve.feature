Feature: Notes Management - Create and Read
  As an authenticated user
  I want to retrieve notes
  So that I can manage my personal information

  Background:
    Given the Notes API is available
    And a user is logged in with valid credentials

  @crud
  Scenario: Retrieve all notes for authenticated user
    Given the user has created several notes
    When the user retrieves all their notes
    Then the user should receive a successful response
    And the response should contain all the user's notes
    And each note should have an ID, title, description, and timestamps

  @crud
  Scenario: Retrieve a specific note by ID
    Given the user has created a note
    When the user retrieves the note by its ID
    Then the user should receive a successful response
    And the response should contain the correct note details

  @crud @negative
  Scenario: Retrieve a non-existent note
    Given the user has a non-existent note ID
    When the user attempts to retrieve the note
    Then the user should receive a bad request error
    And the error message should indicate the note has invalid id
