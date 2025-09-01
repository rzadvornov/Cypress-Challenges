Feature: Notes Search and Filter
  As an authenticated user
  I want to search and filter my notes
  So that I can quickly find relevant information

  Background:
    Given the Notes API is available
    And I am logged in as a valid user
    And I have created multiple notes with different content

  @search
  Scenario: Search notes by title keyword
    Given a valid user is authenticated
    And the user has notes with various titles
    When a search is performed for the title keyword "work"
    Then the response should be successful (200 OK)
    And the response should only contain notes with "work" in the title
    And notes without the keyword should not be present in the results

  @search
  Scenario: Search notes by description content
    Given a valid user is authenticated
    And the user has notes with various descriptions
    When a search is performed for the description keyword "meeting"
    Then the response should be successful (200 OK)
    And the response should only contain notes that contain "meeting" in the description

  @search
  Scenario: Search notes with no matching results
    Given a valid user is authenticated
    And the user has existing notes
    When a search is performed with a unique keyword that does not match any note
    Then the response should be successful (200 OK)
    And the result set should be empty

  @filter
  Scenario: Filter notes by completion status
    Given a valid user is authenticated
    And the user has both completed and pending notes
    When a filter is applied for the "completed" status
    Then the response should be successful (200 OK)
    And the response should only contain notes with a status of "completed"
    And no pending notes should be present in the results

  @filter
  Scenario: Filter notes by creation date range
    Given a valid user is authenticated
    And the user has notes created on different dates
    When a filter is applied for a specific creation date range
    Then the response should be successful (200 OK)
    And the response should only contain notes created within the specified date range
