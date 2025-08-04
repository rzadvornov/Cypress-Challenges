Feature: JavaScript Dialog Handling
    As a test automation engineer
    I want to practice handling different types of JavaScript dialogs
    So that I can automate applications that use JavaScript alerts, confirms, and prompts

    Background:
        Given the user is on the Dialogs practice page
        And the Dialogs page has loaded completely

    Scenario: Handle JavaScript Alert Dialog
        Given the user have set up alert handling
        When the user clicks the 'Alert' button
        Then the alert should be triggered
        And the Dialogs page should display 'OK'

    Scenario: Handle JavaScript Confirm Dialog - Accept
        Given the user have configured confirm handling to accept
        When the user clicks the 'Confirm' button
        Then the confirm dialog should be triggered
        And the Dialogs page should display 'Ok'

    Scenario: Handle JavaScript Confirm Dialog - Dismiss
        Given the user have configured confirm handling to dismiss
        When the user clicks the 'Confirm' button
        Then the confirm dialog should be triggered
        And the Dialogs page should display 'Cancel'

    Scenario Outline: Handle JavaScript Prompt Dialog - Enter Text
        Given the user have configured prompt handling to return '<userInput>'
        When the user clicks the 'Prompt' button
        Then the prompt dialog should be triggered
        And the Dialogs page should display '<userInput>'

        Examples:
            | userInput   |
            | Hello World |
            | 1234512345  |
            | !@#$%!@#$%  |
            |             |
            | null        |

    Scenario: Handle JavaScript Prompt Dialog - Cancel
        Given the user have configured prompt handling to dismiss
        When the user clicks the 'Prompt' button
        Then the prompt dialog should be triggered
        And the Dialogs page should display ''
