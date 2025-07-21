Feature: Basic Drag and Drop Functionality
  As a user
  I want to drag elements to valid drop zones
  So that I can interact with drag and drop interfaces effectively


  Scenario: Successfully drag element to valid drop zone
    Given the user is on the Drag and Drop page
    And all drag and drop elements are visible and interactive
    And the user can see element 'A' in the source container
    And the user can see element 'B' in the target container
    When the user drags and drops element 'A' to the target drop zone of element 'B'
    Then the target container should display 'A' at column '1'
    And the source container should display 'B' at column '0'
