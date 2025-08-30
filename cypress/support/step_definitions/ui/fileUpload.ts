import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { fileUploadPage } from "../../../e2e/ui/pages/FileUploadPage";

beforeEach(() => {
  cy.task("cleanupTestFiles");
});

afterEach(() => {
  cy.task("cleanupTestFiles");
});

const VALID_FILE_SIZES = {
  small: 1, // 1KB
  medium: 100, // 100KB
  large: 300, // 300KB
  edge: 499, // 499KB (just under limit)
};

const INVALID_FILE_SIZES = {
  zero: 0, // Empty file size
  atLimit: 500, // 500KB (at limit)
  over: 1000, // 1MB
  large: 5000, // 5MB
};

let fileName = "";

Given("the user is on the File Upload page", () => {
  fileUploadPage.visit();
});

Given("the file upload page content is displayed", () => {
  fileUploadPage.verifyPageLoaded();
});

Given("the user has a file that is less than 500KB", () => {
  fileName = "test-valid-file.txt";
  cy.task("createTestFile", {
    size: VALID_FILE_SIZES.medium,
    filename: fileName,
  }).as("validFilePath");
});

Given("the user has a file that is 500KB or larger", () => {
  fileName = "test-large-file.txt";
  cy.task("createTestFile", {
    size: INVALID_FILE_SIZES.atLimit,
    filename: fileName,
  }).as("largeFilePath");
});

Given(
  "the user attempts to upload files in following {string} format",
  (format: string) => {
    fileName = `test-file${format}`;
    cy.task("createTestFile", {
      size: VALID_FILE_SIZES.small,
      filename: fileName,
    }).as("validFilePath");
  }
);

Given("the user has a file that is exactly {string} KB", (size: string) => {
  fileName = `test-${size}kb-file.txt`;
  cy.task("createTestFile", {
    size: size,
    filename: fileName,
  }).as("testFilePath");
});

Given("the user has a file with special characters in the filename", () => {
  fileName = "test-@#$%^&()_+special-chars.txt";
  cy.task("createTestFile", {
    size: VALID_FILE_SIZES.small,
    filename: fileName,
  }).as("specialCharFilePath");
});

Given("the user has a file with a very long filename", () => {
  fileName = "test-" + "a".repeat(255) + ".txt";
  cy.task("createTestFile", {
    size: VALID_FILE_SIZES.small,
    filename: fileName,
  }).as("longNameFilePath");
});

When("the user clicks on the file chooser button", () => {});

When("the user selects created file", () => {
  fileUploadPage.selectFile(`cypress/fixtures/${fileName}`);
});

When("the user clicks the 'Upload' button", () => {
  fileUploadPage.submit();
});

When("each file is less than 500KB", () => {
  // This is validated by the file creation in the previous step
  cy.log("All test files are created with size less than 500KB");
});

Then("the file should be uploaded successfully", () => {
  fileUploadPage.verifyFileUploaded(fileName);
});

Then(
  "the user should see an error message indicating the file size limit exceeded",
  () => {
    fileUploadPage.verifyFileValidationError();
  }
);

Then("all supported file types should upload successfully", () => {
  fileUploadPage.verifyFileUploadHeader();
});
