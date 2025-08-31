import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import StatusCode from "status-code-enum";
import { testDataAPI } from "../../../../e2e/api/support/TestDataAPI";
import { notesAPI } from "../../../../e2e/api/notes/NotesAPI";

When("I delete the note", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@noteId").then((noteId) => {
      notesAPI
        .delete(token as unknown as string, noteId as unknown as string)
        .then((response) => {
          cy.wrap(response).as("apiResponse");
        });
    });
  });
});

When("I attempt to delete the note", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@nonExistentNoteId").then((noteId) => {
      notesAPI
        .delete(token as unknown as string, noteId as unknown as string)
        .then((response) => {
          cy.wrap(response).as("apiResponse");
        });
    });
  });
});

Then("I should receive a successful deletion response", () => {
  cy.get("@apiResponse").then((response) => {
    const actualResponse = notesAPI.normalizeResponse(response);
    expect(actualResponse.status).to.be.oneOf([
      StatusCode.SuccessOK,
      StatusCode.SuccessNoContent,
    ]);
  });
});

Then("the note should no longer exist in the system", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@noteId").then((noteId) => {
      notesAPI
        .getById(token as unknown as string, noteId as unknown as string)
        .then((response) => {
          expect(response.status).to.equal(StatusCode.ClientErrorNotFound);
        });
    });
  });
});

// Cleanup after each scenario
afterEach(() => {
  // Clean up test data
  if (testDataAPI) {
    testDataAPI.cleanup();
  }
});
