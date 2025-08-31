import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import StatusCode from "status-code-enum";
import { Note } from "../../../../e2e/api/notes/types/note";
import { testDataAPI } from "../../../../e2e/api/support/TestDataAPI";
import { notesAPI } from "../../../../e2e/api/notes/NotesAPI";

Given("the user has created several notes", () => {
  cy.get("@authToken").then((token) => {
    testDataAPI
      .createMultipleNotes(token as unknown as string, 3)
      .then((notes: Note[]) => {
        cy.wrap(notes).as("createdNotes");
      });
  });
});

Given("the user has created a note", () => {
  cy.get("@authToken").then((token) => {
    const noteData = testDataAPI.generateNote();
    testDataAPI
      .createNote(token as unknown as string, noteData)
      .then((note: Note) => {
        cy.wrap(note).as("createdNote");
        cy.wrap(note.id).as("noteId");
      });
  });
});

Given("the user has a non-existent note ID", () => {
  cy.wrap("non-existent-id-12345").as("nonExistentNoteId");
});

When("the user retrieves all their notes", () => {
  cy.get("@authToken").then((token) => {
    notesAPI.getAll(token as unknown as string).then((response) => {
      cy.wrap(response).as("apiResponse");
    });
  });
});

When("the user retrieves the note by its ID", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@noteId").then((noteId) => {
      notesAPI
        .getById(token as unknown as string, noteId as unknown as string)
        .then((response) => {
          cy.wrap(response).as("apiResponse");
        });
    });
  });
});

When("the user attempts to retrieve the note", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@nonExistentNoteId").then((noteId) => {
      notesAPI
        .getById(token as unknown as string, noteId as unknown as string)
        .then((response) => {
          cy.wrap(response).as("apiResponse");
        });
    });
  });
});

Then("the user should receive a successful response", () => {
  cy.get("@apiResponse").then((response) => {
    notesAPI.validateResponseStatusCode(response, StatusCode.SuccessOK);
  });
});

Then("the response should contain all the user's notes", () => {
  cy.get("@apiResponse").then((response) => {
    const actualResponse = notesAPI.normalizeResponse(response);
    expect(actualResponse.body.data).to.be.an("array");
    expect(actualResponse.body.data.length).to.be.greaterThan(0);
  });
});

Then("each note should have an ID, title, description, and timestamps", () => {
  cy.get("@apiResponse").then((response) => {
    const actualResponse = notesAPI.normalizeResponse(response);
    actualResponse.body.data.forEach((note: Note) => {
      notesAPI.validateNoteStructure(note);
    });
  });
});

Then("the response should contain the correct note details", () => {
  cy.get("@apiResponse").then((response) => {
    cy.get("@createdNote").then((originalNote) => {
      const actualResponse = notesAPI.normalizeResponse(response);
      const responseNote = actualResponse.body.data;
      const createdNote = originalNote as unknown as Note;
      expect(responseNote.id).to.equal(createdNote.id);
      expect(responseNote.title).to.equal(createdNote.title);
      expect(responseNote.description).to.equal(createdNote.description);
    });
  });
});

Then("the user should receive a not found error", () => {
  cy.get("@apiResponse").then((response) => {
    notesAPI.validateResponseStatusCode(response, StatusCode.ClientErrorNotFound);
  });
});

Then("the error message should indicate the note was not found", () => {
  cy.get("@apiResponse").then((response) => {
    const actualResponse = notesAPI.normalizeResponse(response);
    expect(actualResponse.body).to.have.property("message");
    expect(actualResponse.body.message).to.match(/not found|does not exist/i);
  });
});

// Cleanup after each scenario
afterEach(() => {
  // Clean up test data
  if (testDataAPI) {
    testDataAPI.cleanup();
  }
});
