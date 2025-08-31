Feature: User Authentication
  As a user of the Notes API
  I want to authenticate myself
  So that I can manage my personal notes securely

  Background:
    Given the Notes API is available

@smoke @auth
Scenario: User registration with valid credentials
  Given a user has valid registration details
  When a user registers a new user account
  Then a user should receive a successful registration response
  And the response should include user details

@auth @negative
Scenario: User registration with invalid email format
  Given a user has registration details with invalid email format
  When a user attempts to register a new user account
  Then a user should receive a validation error
  And the error message should indicate invalid email format

@auth
Scenario: User login with valid credentials
  Given a user has a registered user account
  When a user logs in with valid credentials
  Then a user should receive a successful login response
  And a user should get a valid authentication token
  And the token should not be expired

@auth @negative
Scenario: User login with invalid credentials
  Given a user has invalid login credentials
  When a user attempts to login
  Then a user should receive an authentication error
  And a user should not receive an authentication token

@auth
Scenario: User logout
  Given a user is logged in as a valid user
  When a user logs out from the system
  Then a user should receive a successful logout response
  And the authentication token should be invalidated  
