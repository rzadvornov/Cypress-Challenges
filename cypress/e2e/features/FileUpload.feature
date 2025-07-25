Feature: Basic File Upload Functionality

  Background:
    Given the user is on the File Upload page
    And the file upload page content is displayed

  Scenario: Successful File Upload - Valid File Size
    Given the user has a file that is less than 500KB
    When the user clicks on the file chooser button
    And the user selects created file
    And the user clicks the 'Upload' button
    Then the file should be uploaded successfully

  Scenario: File Upload Rejection - File Size Exceeds Limit
    Given the user has a file that is 500KB or larger
    When the user clicks on the file chooser button
    And the user selects created file
    And the user clicks the 'Upload' button
    Then the user should see an error message indicating the file size limit exceeded

  Scenario Outline: File Upload - Multiple File Types
    Given the user attempts to upload files in following '<Format>' format
    And each file is less than 500KB
    When the user clicks on the file chooser button
    And the user selects created file
    And the user clicks the 'Upload' button
    Then the file should be uploaded successfully
    Examples:
      | Format |
      | .txt   |
      | .doc   |
      | .pdf   |
      | .jpg   |

  Scenario: File Upload - Edge Case File Size (Just Under Limit)
    Given the user has a file that is exactly '499' KB
    When the user clicks on the file chooser button
    And the user selects created file
    And the user clicks the 'Upload' button
    Then the file should be uploaded successfully

  Scenario: File Upload - Edge Case File Size (At Limit)
    Given the user has a file that is exactly '500' KB
    When the user clicks on the file chooser button
    And the user selects created file
    And the user clicks the 'Upload' button
    Then the user should see an error message indicating the file size limit exceeded

  Scenario: File Upload - Empty File
    Given the user has a file that is exactly '0' KB
    When the user clicks on the file chooser button
    And the user selects created file
    And the user clicks the 'Upload' button
    Then the file should be uploaded successfully

  Scenario: File Upload - Special Characters in Filename
    Given the user has a file with special characters in the filename
    When the user clicks on the file chooser button
    And the user selects created file
    And the user clicks the 'Upload' button
    Then the file should be uploaded successfully

  Scenario: File Upload - Very Long Filename
    Given the user has a file with a very long filename
    When the user clicks on the file chooser button
    And the user selects created file
    And the user clicks the 'Upload' button
    Then the file should be uploaded successfully  