Feature: Checkout Process
  As a customer
  I want to complete my purchase
  So that I can buy the books I've selected

  Background:
    Given the user is on the bookstore Homepage
    And the bookstore Homepage has loaded completely

  Scenario: Guest checkout
    Given the user has registered account
    And the user is logged out
    And the user clicks 'Add to Cart' for the book titled 'JavaScript for Web Developers'
    Then the cart icon should show '1' item
    When the user clicks on the shopping cart icon
    Then the Cart Page should be loaded
    And the total amount should update accordingly
    When the user clicks 'Proceed To Checkout' button
    Then the 'Sign In' page should be loaded
    And the user enters his email
    And the user enters his password
    And the user clicks 'Sign In' button at 'Sign In' page
    Then the user should be logged in
    And the Checkout Page should be loaded

  Scenario: Checkout with account
    Given the user has registered account
    And the user is logged out
    When the user clicks on 'Sign In' button at 'Bookstore Home' page
    Then the 'Sign In' page should be loaded
    And the user enters his email
    And the user enters his password
    And the user clicks 'Sign In' button at 'Sign In' page
    Then the user should be logged in
    And the user should see his account dashboard
    And the user navigates to Home Page
    And the user clicks 'Add to Cart' for the book titled 'JavaScript for Web Developers'
    Then the cart icon should show '1' item
    When the user clicks on the shopping cart icon
    Then the Cart Page should be loaded
    And the total amount should update accordingly
    When the user clicks 'Proceed To Checkout' button
    Then the Checkout Page should be loaded

  Scenario: Payment with Stripe
    Given the user has registered account
    And the user is logged out
    And the user clicks 'Add to Cart' for the book titled 'JavaScript for Web Developers'
    Then the cart icon should show '1' item
    When the user clicks on the shopping cart icon
    Then the Cart Page should be loaded
    And the total amount should update accordingly
    When the user clicks 'Proceed To Checkout' button
    Then the 'Sign In' page should be loaded
    And the user enters his email
    And the user enters his password
    And the user clicks 'Sign In' button at 'Sign In' page
    Then the user should be logged in
    And the Checkout Page should be loaded
    When the user enters valid payment information:
      | Field            | Value                                                    |
      | Card Number      | 4242424242424242                                         |
      | Expiration Month | 12                                                       |
      | CVC              | 123                                                      |
      | Name             | John Doe                                                 |
      | Address          | London, Claridge's, Brook Street 490, Post Code: W1K 5LH |
      | Card Holder Name | JOHN DOE                                                 |
    And the user clicks 'Purchase' button
    Then the user should see his account dashboard
    And the order information should be present

  Scenario: Payment with invalid card
    Given the user has registered account
    And the user is logged out
    And the user clicks 'Add to Cart' for the book titled 'JavaScript for Web Developers'
    Then the cart icon should show '1' item
    When the user clicks on the shopping cart icon
    Then the Cart Page should be loaded
    And the total amount should update accordingly
    When the user clicks 'Proceed To Checkout' button
    Then the 'Sign In' page should be loaded
    And the user enters his email
    And the user enters his password
    And the user clicks 'Sign In' button at 'Sign In' page
    Then the user should be logged in
    And the Checkout Page should be loaded
    When the user enters valid payment information:
      | Field            | Value                                                    |
      | Card Number      | 4000000000000002                                         |
      | Expiration Month | 12                                                       |
      | CVC              | 123                                                      |
      | Name             | John Doe                                                 |
      | Address          | London, Claridge's, Brook Street 490, Post Code: W1K 5LH |
      | Card Holder Name | JOHN DOE                                                 |
    And the user clicks 'Purchase' button
    Then the user should see error message indicating declined card
