Feature: Notes Search and Filter
  As an authenticated user
  I want to search and filter my notes
  So that I can quickly find relevant information

  Background:
    Given the Notes API is available
    And a user is logged in with valid credentials
    And the user has created multiple notes with different content

  @search
  Scenario: Search notes by title keyword
    Given the user has notes with various titles
    When a search is performed for the title keyword "work"
    Then the response status should be 200
    And the response should only contain notes with "work" in the title
    And notes without the keyword should not be present in the results

  @search
  Scenario: Search notes by description content
    Given the user has notes with various descriptions
    When a search is performed for the description keyword "meeting"
    Then the response status should be 200
    And the response should only contain notes that contain "meeting" in the description

  @search
  Scenario: Search notes with no matching results
    Given the user has created several notes
    When a search is performed with a unique keyword that does not match any note
    Then the response status should be 200
    And the result set should be empty

  @filter
  Scenario: Filter notes by completion status
    Given the user has both completed and pending notes
    When a filter is applied for the "completed" status
    Then the response status should be 200
    And the response should only contain notes with a status of "completed"
    And no pending notes should be present in the results
