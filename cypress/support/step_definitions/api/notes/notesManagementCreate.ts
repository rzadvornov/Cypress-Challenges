import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import StatusCode from "status-code-enum";
import { Note } from "../../../../e2e/api/notes/types/note";
import { NoteCreate } from "../../../../e2e/api/notes/types/noteCreate";
import { testDataAPI } from "../../../../e2e/api/support/TestDataAPI";
import { notesAPI } from "../../../../e2e/api/notes/NotesAPI";

Given("the user has valid note data", () => {
  const noteData = testDataAPI.generateNote();
  cy.wrap(noteData).as("noteData");
});

Given("the user has note data with only a title", () => {
  const noteData = testDataAPI.generateNote({
    title: "Test Note Title",
    description: "",
  });
  cy.wrap(noteData).as("noteData");
});

Given("the user has incomplete note data", () => {
  const incompleteData = {
    // Missing required fields
  };
  cy.wrap(incompleteData).as("noteData");
});

When("the user creates a new note", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@noteData").then((noteData) => {
      notesAPI
        .create(token as unknown as string, noteData as unknown as NoteCreate)
        .then((response) => {
          cy.wrap(response).as("apiResponse");
          if (response.status === StatusCode.SuccessOK) {
            cy.wrap(response.body.data).as("createdNote");
            cy.wrap(response.body.data.id).as("noteId");
          }
        });
    });
  });
});

When("the user attempts to create a new note", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@noteData").then((noteData) => {
      notesAPI
        .create(token as unknown as string, noteData as unknown as NoteCreate)
        .then((response) => {
          cy.wrap(response).as("apiResponse");
        });
    });
  });
});

Then("the user should receive a successful creation response", () => {
  cy.get("@apiResponse").then((response) => {
    notesAPI.validateResponseStatusCode(response, StatusCode.SuccessOK);
    const actualResponse = notesAPI.normalizeResponse(response);
    expect(actualResponse.body).to.have.property("data");
  });
});

Then("the response should include the note ID", () => {
  cy.get("@createdNote").then((note) => {
    const createdNote = note as unknown as Note;
    expect(createdNote).to.have.property("id");
    expect(createdNote.id).to.be.a("string").and.not.be.empty;
  });
});

Then("the note should contain the provided title and description", () => {
  cy.get("@createdNote").then((note) => {
    cy.get("@noteData").then((noteData) => {
      const createdNote = note as unknown as Note;
      const originalData = noteData as unknown as NoteCreate;
      expect(createdNote.title).to.equal(originalData.title);
      expect(createdNote.description).to.equal(originalData.description);
    });
  });
});

Then("the note should have a creation timestamp", () => {
  cy.get("@createdNote").then((note) => {
    const createdNote = note as unknown as Note;
    expect(createdNote).to.have.property("created_at");
    expect(createdNote).to.have.property("updated_at");
    expect(new Date(createdNote.created_at)).to.be.instanceOf(Date);
    expect(new Date(createdNote.updated_at)).to.be.instanceOf(Date);
  });
});

Then("the note description should be empty or null", () => {
  cy.get("@createdNote").then((note) => {
    const createdNote = note as unknown as Note;
    expect(createdNote.description).to.satisfy(
      (desc: string) => desc === "" || desc === null || desc === undefined
    );
  });
});

Then("the error should specify missing required fields", () => {
  cy.get("@apiResponse").then((response) => {
    const actualResponse = notesAPI.normalizeResponse(response);
    expect(actualResponse.body).to.have.property("message");
    expect(actualResponse.body.message).to.match(/required|missing|invalid/i);
  });
});

// Cleanup after each scenario
afterEach(() => {
  // Clean up test data
  if (testDataAPI) {
    testDataAPI.cleanup();
  }
});
