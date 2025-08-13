Feature: Book Details
  As a customer
  I want to view detailed information about a book
  So that I can make an informed purchase decision

  Background:
    Given the user is on the bookstore Homepage
    And the bookstore Homepage has loaded completely

  Scenario: View Book Details page
    Given the user clicks on a book titled 'JavaScript for Web Developers'
    Then the user should be redirected to the Book Details page
    And the user should see the book title 'JavaScript for Web Developers'
    And the user should see the book price
    And the user should see a book description
    And the user should see an 'Add to Cart' button

  Scenario: Add book to cart from Book Details page
    Given the user clicks on a book titled 'JavaScript for Web Developers'
    Then the user should be redirected to the Book Details page
    When the user clicks the 'Add to Cart' button
    Then the cart counter should increase by 1