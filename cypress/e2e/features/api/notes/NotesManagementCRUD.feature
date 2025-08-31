Feature: Notes Management - Create and Read
  As an authenticated user
  I want to create, retrieve, update and delete notes
  So that I can manage my personal information

  Background:
    Given the Notes API is available
    And a user is logged in with valid credentials

  @crud @smoke
  Scenario: Create a new note with valid data
    Given the user has valid note data
    When the user creates a new note
    Then the user should receive a successful creation response
    And the response should include the note ID
    And the note should contain the provided title and description
    And the note should have a creation timestamp

  @crud @negative
  Scenario: Create a note with only title
    Given the user has note data with only a title
    When the user creates a new note
    Then the user should receive a validation error
    And the error should specify missing required field
    And the note description should be empty or null

  @crud @negative
  Scenario: Create a note without required fields
    Given the user has incomplete note data
    When the user attempts to create a new note
    Then the user should receive a validation error
    And the error should specify missing required fields

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
    Then the user should receive a not found error
    And the error message should indicate the note was not found

  @crud
  Scenario: Update an existing note
    Given I have created a note
    When I update the note with new information
    Then I should receive a successful update response
    And the note should contain the updated information
    And the note should have an updated timestamp

  @crud
  Scenario: Partially update a note (PATCH)
    Given I have created a note with title and description
    When I update only the title of the note
    Then I should receive a successful update response
    And the title should be updated
    And the description should remain unchanged

  @crud @negative
  Scenario: Update a non-existent note
    Given I have a non-existent note ID
    When I attempt to update the note
    Then I should receive a not found error

  @crud @negative
  Scenario: Update a note with invalid data
    Given I have created a note
    When I attempt to update the note with invalid data
    Then I should receive a validation error

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
