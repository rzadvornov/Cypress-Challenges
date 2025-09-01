Feature: Notes Management - Create and Read
  As an authenticated user
  I want to update notes
  So that I can manage my personal information

  Background:
    Given the Notes API is available
    And a user is logged in with valid credentials

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
