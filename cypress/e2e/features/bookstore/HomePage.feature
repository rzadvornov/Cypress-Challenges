Feature: Bookstore Homepage
  As a customer
  I want to browse the bookstore homepage
  So that I can see available books and navigate the site

  Background:
    Given the user is on the bookstore Homepage
    And the bookstore Homepage has loaded completely

  Scenario: View homepage with book catalog
    Then the user should see the bookstore logo
    And the user should see a list of available books
    And each book should display title, author, and price
    And the user should see navigation elements

  Scenario: Search for books
    When the user enters "JavaScript" in the search field
    And the user clicks the 'Search' button
    Then the user should see search results for "JavaScript"
    And each result should contain "JavaScript" in the title

  Scenario Outline: Filter books by category
    When the user selects category '<categoryId>' from the category filter
    Then the user should see a list of available books
    And each book should display title, author, and price
    And the user should see navigation elements
    Examples:
      | categoryId               |
      | 674106645b85ae33d4d10e62 |
      | 6741066a5b85ae33d4d10e65 |
      | 674106705b85ae33d4d10e68 |

  Scenario Outline: Responsive layout on different screen sizes
    Given the user views the site on a device with resolution '<resolution>'
    Then the bookstore Homepage has loaded completely

    Examples:
      | device  | resolution |
      | mobile  | 375x667    |
      | tablet  | 768x1024   |
      | desktop | 1920x1080  |
