Feature: Shopping Cart
  As a customer
  I want to manage items in my shopping cart
  So that I can review and modify my purchases

  Background:
    Given the user is on the bookstore Homepage
    And the bookstore Homepage has loaded completely

  Scenario: Add book to cart and view cart contents
    Given the user clicks 'Add to Cart' for the book titled 'JavaScript for Web Developers'
    Then the cart icon should show '1' item
    When the user clicks on the shopping cart icon
    Then the cart page should load
    And the user should see 'JavaScript for Web Developers' in his cart
    And the user should see the correct price for the item

  Scenario: Update quantity in cart
    Given the user clicks 'Add to Cart' for the book titled 'JavaScript for Web Developers'
    When the user clicks on the shopping cart icon
    Then the cart page should load
    When the user changes the quantity to '2'
    Then the total price should update accordingly

  Scenario: Remove item from cart
    Given the user clicks 'Add to Cart' for the book titled 'JavaScript for Web Developers'
    When the user clicks on the shopping cart icon
    And the user clicks 'Delete' button for "JavaScript for Web Developers"
    Then the item should be removed from his cart
    And the cart should show as empty

  Scenario: Empty cart state
    When the user clicks on the shopping cart icon
    Then the cart should show as empty