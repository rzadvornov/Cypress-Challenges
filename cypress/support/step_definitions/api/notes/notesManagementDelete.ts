import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import StatusCode from "status-code-enum";
import { testDataAPI } from "../../../../e2e/api/support/TestDataAPI";
import { notesAPI } from "../../../../e2e/api/notes/NotesAPI";
import { GeneralUtils } from "../../../utilities/GeneralUtils";

When("a request is made to delete the note", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@noteId").then((noteId) => {
      const actualToken = GeneralUtils.getWrappedData(token);
      const actualNoteId = GeneralUtils.getWrappedData(noteId);
      notesAPI.delete(actualToken, actualNoteId).then((response) => {
        cy.wrap(response).as("apiResponse");
      });
    });
  });
});

When("a request is made to delete the unexistent note", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@nonExistentNoteId").then((noteId) => {
      const actualToken = GeneralUtils.getWrappedData(token);
      const actualNoteId = GeneralUtils.getWrappedData(noteId);
      notesAPI.delete(actualToken, actualNoteId).then((response) => {
        cy.wrap(response).as("apiResponse");
      });
    });
  });
});

Then("the response status should be 200 or 204", () => {
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
      const actualToken = GeneralUtils.getWrappedData(token);
      const actualNoteId = GeneralUtils.getWrappedData(noteId);
      notesAPI.getById(actualToken, actualNoteId).then((response) => {
        expect(response.status).to.equal(StatusCode.ClientErrorNotFound);
      });
    });
  });
});

afterEach(() => {
  if (testDataAPI) {
    testDataAPI.cleanup();
  }
});
