import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import StatusCode from "status-code-enum";
import { Note } from "../../../../e2e/api/notes/types/note";
import { testDataAPI } from "../../../../e2e/api/support/TestDataAPI";
import { notesAPI } from "../../../../e2e/api/notes/NotesAPI";
import { NoteUpdate } from "../../../../e2e/api/notes/types/noteUpdate";
import { GeneralUtils } from "../../../utilities/GeneralUtils";

Given("the user has an existing note", () => {
  cy.get("@authToken").then((token) => {
    const actualToken = GeneralUtils.getWrappedData(token);
    const noteData = testDataAPI.generateNote();
    testDataAPI.createNote(actualToken, noteData).then((note: Note) => {
      cy.wrap(note).as("createdNote");
      cy.wrap(note.id).as("noteId");
    });
  });
});

Given(
  "the user has an existing note with a specific title and description",
  () => {
    cy.get("@authToken").then((token) => {
      const actualToken = GeneralUtils.getWrappedData(token);
      const noteData = testDataAPI.generateNote({
        title: "Original Title",
        description: "Original Description",
      });
      testDataAPI.createNote(actualToken, noteData).then((note: Note) => {
        cy.wrap(note).as("createdNote");
        cy.wrap(note.id).as("noteId");
      });
    });
  }
);

Given("a note ID that does not exist in the system is provided", () => {
  cy.wrap("non-existent-update-id-12345").as("nonExistentNoteId");
});

When("a request is made to update the note with new valid information", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@noteId").then((noteId) => {
      cy.get("@createdNote").then((note) => {
        const actualToken = GeneralUtils.getWrappedData(token);
        const actualNoteId = GeneralUtils.getWrappedData(noteId);
        const createdNote = GeneralUtils.getWrappedData(note);
        const updatedData: NoteUpdate = {
          title: "Updated Title",
          description: "Updated Description",
          category: "Work",
          completed: !createdNote.completed,
        };

        cy.wrap(updatedData).as("updatedNoteData");

        notesAPI
          .update(actualToken, actualNoteId, updatedData)
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

When("a PATCH request is made to update only the title field", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@noteId").then((noteId) => {
      const actualToken = GeneralUtils.getWrappedData(token);
      const actualNoteId = GeneralUtils.getWrappedData(noteId);
      const partialUpdate = {
        title: "Updated Title Only",
        completed: false,
      };

      cy.wrap(partialUpdate).as("updatedNoteData");

      notesAPI
        .patch(actualToken, actualNoteId, partialUpdate)
        .then((response) => {
          cy.wrap(response).as("apiResponse");
          if (response.status === StatusCode.SuccessOK) {
            cy.wrap(response.body.data).as("updatedNote");
          }
        });
    });
  });
});

When("a request is made to update the note", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@nonExistentNoteId").then((noteId) => {
      const actualToken = GeneralUtils.getWrappedData(token);
      const actualNoteId = GeneralUtils.getWrappedData(noteId);
      const updateData = { title: "Updated Title" };
      notesAPI
        .update(actualToken, actualNoteId, updateData)
        .then((response) => {
          cy.wrap(response).as("apiResponse");
        });
    });
  });
});

When(
  "a request is made to update the note with invalid or malformed data",
  () => {
    cy.get("@authToken").then((token) => {
      cy.get("@noteId").then((noteId) => {
        const actualToken = GeneralUtils.getWrappedData(token);
        const actualNoteId = GeneralUtils.getWrappedData(noteId);
        const invalidData = {
          title: "", // Assuming empty title is invalid
          description: undefined,
        };

        notesAPI
          .update(actualToken, actualNoteId, invalidData)
          .then((response) => {
            cy.wrap(response).as("apiResponse");
          });
      });
    });
  }
);

Then("the response should contain the updated note information", () => {
  cy.get("@updatedNote").then((note) => {
    cy.get("@updatedNoteData").then((updateData) => {
      const updatedNote = GeneralUtils.getWrappedData(note);
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

Then("the note's last updated timestamp should be changed", () => {
  cy.get("@updatedNote").then((note) => {
    const updatedNote = GeneralUtils.getWrappedData(note);
    expect(new Date(updatedNote.updated_at)).to.be.instanceOf(Date);
    expect(updatedNote.updated_at).to.not.equal(updatedNote.created_at);
  });
});

Then("the note's title should be updated to the new value", () => {
  cy.get("@updatedNote").then((note) => {
    cy.get("@updatedNoteData").then((updateData) => {
      const updatedNote = GeneralUtils.getWrappedData(note);
      const updatedNoteData = updateData as Partial<NoteUpdate>;
      expect(updatedNote.title).to.equal(updatedNoteData.title);
    });
  });
});

Then(
  "the note's description should remain unchanged from its original value",
  () => {
    cy.get("@createdNote").then((originalNote) => {
      cy.get("@updatedNote").then((note) => {
        const original = GeneralUtils.getWrappedData(originalNote);
        const updated = GeneralUtils.getWrappedData(note);
        expect(updated.description).to.equal(original.description);
      });
    });
  }
);

Then("the response should contain a validation error", () => {
  cy.get("@apiResponse").then((response) => {
    const actualResponse = notesAPI.normalizeResponse(response);
    expect(actualResponse.body).to.have.property("message");
    expect(actualResponse.body.message).to.be.eq('Title must be between 4 and 100 characters');
  });
});

Then("the note's data should remain unchanged", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@createdNote").then((note) => {
      cy.get("@noteId").then((noteId) => {
        const createdNote = GeneralUtils.getWrappedData(note);
        const actualToken = GeneralUtils.getWrappedData(token);
        const actualNoteId = GeneralUtils.getWrappedData(noteId);
        notesAPI.getById(actualToken, actualNoteId).then((response) => {
          expect(response.body.data).not.be.empty;
          expect(response.body.data.id).to.be.eq(actualNoteId);
          expect(response.body.data.category).to.be.eq(createdNote.category);
          expect(response.body.data.completed).to.be.eq(createdNote.completed);
          expect(response.body.data.description).to.be.eq(
            createdNote.description
          );
          expect(response.body.data.title).to.be.eq(createdNote.title);
          expect(response.body.data.updated_at).to.be.eq(
            createdNote.updated_at
          );
          expect(response.body.data.user_id).to.be.eq(createdNote.user_id);
        });
      });
    });
  });
});

afterEach(() => {
  if (testDataAPI) {
    testDataAPI.cleanup();
  }
});
