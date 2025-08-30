Feature: User Login Authentication
  As a registered user
  I want to login to my account
  So that I can access protected features with proper validation

  Background:
    Given the user is on the Login page
    And the login form is displayed

  Scenario: Successful login with valid username and password
    Given the user enters valid username
    And the user enters valid password
    When the user clicks the 'Login' button
    Then the user should be redirected to the dashboard page
    And the user should see greeting message
    And the user should see a 'You logged into a secure area!' alert message
    And the user session should be established
    When the user clicks Logout button
    Then the user session should be disconnected
    And the user should be redirected to Login page

  Scenario Outline: Login attempt with empty/invalid fields
    Given the user enters username '<username>'
    And the user enters password '<password>'
    And the user clicks the 'Login' button
    Then the user should remain on the Login page
    And an error message '<error_message>' should be displayed
    And the username field should be cleared
    And the password field should be cleared
    And no user session should be established

    Examples:
      | username              | password         | error_message             |
      | ""                    | ""               | Your username is invalid! |
      | practice              | WrongPassword123 | Your password is invalid! |
      | ""                    | SecurePass123!   | Your username is invalid! |
      | testuser@example.com  | ""               | Your username is invalid! |
      | wronguser@example.com | SecurePass123!   | Your username is invalid! |

  Scenario Outline: SQL injection protection in login/password fields
    Given the user enters username '<malicious_input>'
    And the user enters password '<password>'
    And the user clicks the 'Login' button
    Then the user should remain on the Login page
    And an error message '<error_message>' should be displayed
    And the username field should be cleared
    And the password field should be cleared
    And no user session should be established

    Examples:
      | malicious_username_input       | malicious_password_input | error_message             |
      | admin' OR '1'='1' --           | password123              | Your username is invalid! |
      | admin'; DROP TABLE users; --   | password123              | Your username is invalid! |
      | ' UNION SELECT * FROM users -- | password123              | Your username is invalid! |
      | admin' OR 1=1 /*               | password123              | Your username is invalid! |
      | practice                       | password' OR '1'='1' --  | Your password is invalid! |

  Scenario Outline: XSS protection in login/password fields
    Given the user enters username '<xss_payload>'
    And the user enters password '<xss_payload>'
    And the user clicks the 'Login' button
    Then the user should remain on the Login page
    And an error message '<error_message>' should be displayed
    And the username field should be cleared
    And the password field should be cleared
    And no user session should be established

    Examples:
      | xss_username_payload             | error_message             |
      | <script>alert('XSS')</script>    | Your username is invalid! |
      | javascript:alert('XSS')          | Your username is invalid! |
      | <img src=x onerror=alert('XSS')> | Your username is invalid! |
      | <svg onload=alert('XSS')>        | Your username is invalid! |
      | "><script>alert('XSS')</script>  | Your username is invalid! |
