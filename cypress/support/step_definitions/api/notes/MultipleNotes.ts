import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import StatusCode from "status-code-enum";
import { Note } from "../../../../e2e/api/notes/types/note";
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

// Multiple Notes Steps
Given("I have created multiple notes", () => {
  cy.get("@authToken").then((token) => {
    testDataAPI
      .createMultipleNotes(token as unknown as string, 5)
      .then((notes: Note[]) => {
        cy.wrap(notes).as("createdNotes");
        expect(notes).to.have.length(5);
      });
  });
});

When("I delete one specific note", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@createdNotes").then((notes) => {
      const createdNotes = notes as unknown as Note[];
      const noteToDelete = createdNotes[0];
      cy.wrap(noteToDelete.id).as("deletedNoteId");

      notesAPI
        .delete(token as unknown as string, noteToDelete.id)
        .then((response) => {
          cy.wrap(response).as("apiResponse");
        });
    });
  });
});

Then("the note should be removed from my notes list", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@deletedNoteId").then((deletedId) => {
      notesAPI.getAll(token as unknown as string).then((response) => {
        const remainingNotes = response.body.data;
        const deletedNoteExists = remainingNotes.some(
          (note: Note) => note.id === (deletedId as unknown as string)
        );
        expect(deletedNoteExists).to.be.false;
      });
    });
  });
});

Then("other notes should remain intact", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@createdNotes").then((originalNotes) => {
      cy.get("@deletedNoteId").then((deletedId) => {
        const createdNotes = originalNotes as unknown as Note[];
        
        notesAPI.getAll(token as unknown as string).then((response) => {
          const remainingNotes = response.body.data;
          // Should have 4 notes remaining (5 created - 1 deleted)
          expect(remainingNotes).to.have.length(createdNotes.length - 1);
          
          // Verify other notes still exist
          const remainingIds = remainingNotes.map((note: Note) => note.id);
          createdNotes
            .filter((note) => note.id !== (deletedId as unknown as string))
            .forEach((note) => {
              expect(remainingIds).to.include(note.id);
            });
        });
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
