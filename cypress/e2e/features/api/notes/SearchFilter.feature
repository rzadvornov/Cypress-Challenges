Feature: Notes Search and Filter
  As an authenticated user
  I want to search and filter my notes
  So that I can quickly find relevant information

  Background:
    Given the Notes API is available at "https://practice.expandtesting.com/notes/api"
    And I am logged in as a valid user
    And I have created multiple notes with different content

  @search
  Scenario: Search notes by title keyword
    Given I have notes with various titles
    When I search notes by title keyword "work"
    Then I should receive notes that contain "work" in the title
    And notes without the keyword should not be returned

  @search
  Scenario: Search notes by description content
    Given I have notes with various descriptions
    When I search notes by description keyword "meeting"
    Then I should receive notes that contain "meeting" in the description

  @search
  Scenario: Search notes with no matching results
    Given I have existing notes
    When I search with a keyword that doesn't match any note
    Then I should receive an empty result set
    And the response should be successful

  @filter
  Scenario: Filter notes by completion status
    Given I have notes with different completion statuses
    When I filter notes by completed status
    Then I should receive only completed notes

  @filter
  Scenario: Filter notes by creation date range
    Given I have notes created on different dates
    When I filter notes by a specific date range
    Then I should receive only notes created within that range
