import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import StatusCode from "status-code-enum";
import { Note } from "../../../../e2e/api/notes/types/note";
import { testDataAPI } from "../../../../e2e/api/support/TestDataAPI";
import { notesAPI } from "../../../../e2e/api/notes/NotesAPI";
import { NoteUpdate } from "../../../../e2e/api/notes/types/noteUpdate";

Given("I have created a note", () => {
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

Given("I have created a note with title and description", () => {
  cy.get("@authToken").then((token) => {
    const noteData = testDataAPI.generateNote({
      title: "Original Title",
      description: "Original Description",
    });
    testDataAPI
      .createNote(token as unknown as string, noteData)
      .then((note: Note) => {
        cy.wrap(note).as("createdNote");
        cy.wrap(note.id).as("noteId");
      });
  });
});

Given("I have a non-existent note ID", () => {
  cy.wrap("non-existent-update-id-12345").as("nonExistentNoteId");
});

When("I update the note with new information", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@noteId").then((noteId) => {
      cy.get("@createdNote").then((note) => {
        const createdNote = note as unknown as Note;
        const updatedData = {
          title: "Updated Title",
          description: "Updated Description",
          completed: !createdNote.completed,
        };

        cy.wrap(updatedData).as("updatedNoteData");

        notesAPI
          .update(
            token as unknown as string,
            noteId as unknown as string,
            updatedData
          )
          .then((response) => {
            cy.wrap(response).as("apiResponse");
            if (response.status === StatusCode.SuccessOK) {
              cy.wrap(response.body.data).as("updatedNote");
            }
          });
      });
    });
  });
});

When("I update only the title of the note", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@noteId").then((noteId) => {
      const partialUpdate = {
        title: "Updated Title Only",
      };

      cy.wrap(partialUpdate).as("updatedNoteData");

      notesAPI
        .patch(
          token as unknown as string,
          noteId as unknown as string,
          partialUpdate
        )
        .then((response) => {
          cy.wrap(response).as("apiResponse");
          if (response.status === StatusCode.SuccessOK) {
            cy.wrap(response.body.data).as("updatedNote");
          }
        });
    });
  });
});

When("I attempt to update the note", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@nonExistentNoteId").then((noteId) => {
      const updateData = { title: "Updated Title" };
      notesAPI
        .update(
          token as unknown as string,
          noteId as unknown as string,
          updateData
        )
        .then((response) => {
          cy.wrap(response).as("apiResponse");
        });
    });
  });
});

When("I attempt to update the note with invalid data", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@noteId").then((noteId) => {
      const invalidData = {
        title: "", // Assuming empty title is invalid
        description: undefined,
      };

      notesAPI
        .update(
          token as unknown as string,
          noteId as unknown as string,
          invalidData
        )
        .then((response) => {
          cy.wrap(response).as("apiResponse");
        });
    });
  });
});

Then("I should receive a successful update response", () => {
  cy.get("@apiResponse").then((response) => {
    notesAPI.validateResponseStatusCode(response, StatusCode.SuccessOK);
    const actualResponse = notesAPI.normalizeResponse(response);
    expect(actualResponse.body).to.have.property("data");
  });
});

Then("the note should contain the updated information", () => {
  cy.get("@updatedNote").then((note) => {
    cy.get("@updatedNoteData").then((updateData) => {
      const updatedNote = note as unknown as Note;
      const updatedNoteData = updateData as Partial<NoteUpdate>;

      if (updatedNoteData.title) {
        expect(updatedNote.title).to.equal(updatedNoteData.title);
      }
      if (updatedNoteData.description !== undefined) {
        expect(updatedNote.description).to.equal(updatedNoteData.description);
      }
      if (updatedNoteData.completed !== undefined) {
        expect(updatedNote.completed).to.equal(updatedNoteData.completed);
      }
    });
  });
});

Then("the note should have an updated timestamp", () => {
  cy.get("@updatedNote").then((note) => {
    const updatedNote = note as unknown as Note;
    expect(new Date(updatedNote.updated_at)).to.be.instanceOf(Date);
    // The updated timestamp should be different from created timestamp
    expect(updatedNote.updated_at).to.not.equal(updatedNote.created_at);
  });
});

Then("the title should be updated", () => {
  cy.get("@updatedNote").then((note) => {
    cy.get("@updatedNoteData").then((updateData) => {
      const updatedNote = note as unknown as Note;
      const updatedNoteData = updateData as Partial<NoteUpdate>;
      expect(updatedNote.title).to.equal(updatedNoteData.title);
    });
  });
});

Then("the description should remain unchanged", () => {
  cy.get("@createdNote").then((originalNote) => {
    cy.get("@updatedNote").then((note) => {
      const original = originalNote as unknown as Note;
      const updated = note as unknown as Note;
      expect(updated.description).to.equal(original.description);
    });
  });
});

Then("I should receive a not found error", () => {
  cy.get("@apiResponse").then((response) => {
    notesAPI.validateResponseStatusCode(response, StatusCode.ClientErrorNotFound);
  });
});

Then("I should receive a validation error", () => {
  cy.get("@apiResponse").then((response) => {
    const actualResponse = notesAPI.normalizeResponse(response);
    expect(actualResponse.status).to.be.oneOf([
      StatusCode.ClientErrorBadRequest,
      StatusCode.ClientErrorUnprocessableEntity,
    ]);
  });
});

// Cleanup after each scenario
afterEach(() => {
  // Clean up test data
  if (testDataAPI) {
    testDataAPI.cleanup();
  }
});
