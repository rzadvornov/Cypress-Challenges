Feature: Shadow DOM Element Detection and Interaction

  Background:
    Given the user is on the Shadow DOM page
    And the Shadow Dom page content is displayed

  Scenario: Verify Shadow DOM Host Element Visibility
    Given user inspects the page structure
    Then user should be able to identify the shadow DOM host element
    And the host element should have a shadow root attached

  Scenario: Access Shadow Root Content
    Given there is a shadow DOM host element present
    When user accesses the shadow root of the host element
    Then the shadow root mode should be either 'open' or 'closed'
