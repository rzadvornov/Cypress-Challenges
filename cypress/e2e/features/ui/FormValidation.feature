Feature: Generic Form Validation
    As a user
    I want to interact with forms on the website
    So that I can submit data with proper validation feedback

    Background:
        Given the user is on the Form Validation page
        And the validation form is displayed

    Scenario: Form validates required fields on submit
        Given the user clears 'Contact Name' text field
        When the user clicks the form 'Register' button
        Then the user should see validation errors for all required fields
        And the form should not be submitted

    Scenario: Form validates phone number format
        Given the user enters an invalid phone number '123-abc-def'
        When the user clicks the form 'Register' button
        Then the user should see an error message indicating invalid phone format
        And the form should not be submitted

    Scenario Outline: Form clears validation errors and gets submitted when valid data is entered
        Given the user clears 'Contact Name' text field
        When the user clicks the form 'Register' button
        Then the user should see validation errors for all required fields
        And the form should not be submitted
        Given the user enters a valid 'Contact Name'
        And the user should see a message confirming that the Contact Name is valid
        And the user enters valid phone number '<phoneNumber>'
        And the user enters todays date
        And the user enters '<paymentMethod>' payment method
        When the user clicks the form 'Register' button
        Then the form should be submitted

        Examples:
            | phoneNumber | paymentMethod    |
            | 123-1234567 | card             |
            | 321-1234568 | cash on delivery |
