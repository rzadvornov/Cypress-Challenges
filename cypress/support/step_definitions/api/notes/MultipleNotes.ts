import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { Note } from "../../../../e2e/api/notes/types/note";
import { testDataAPI } from "../../../../e2e/api/support/TestDataAPI";
import { notesAPI } from "../../../../e2e/api/notes/NotesAPI";
import { GeneralUtils } from "../../../utilities/GeneralUtils";

Given("the user has multiple existing notes", () => {
  cy.get("@authToken").then((token) => {
    const actualToken = GeneralUtils.getWrappedData(token);
    testDataAPI
      .createMultipleNotes(actualToken, 5)
      .then((notes: Note[]) => {
        cy.wrap(notes).as("createdNotes");
        expect(notes).to.have.length(5);
      });
  });
});

When("a request is made to delete one specific note", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@createdNotes").then((notes) => {
      const actualToken = GeneralUtils.getWrappedData(token);
      const createdNotes = GeneralUtils.getWrappedData(notes);
      const noteToDelete = createdNotes[0];
      cy.wrap(noteToDelete.id).as("deletedNoteId");

      notesAPI
        .delete(actualToken, noteToDelete.id)
        .then((response) => {
          cy.wrap(response).as("apiResponse");
        });
    });
  });
});

Then("the deleted note should not appear in the notes list", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@deletedNoteId").then((deletedId) => {
      const actualToken = GeneralUtils.getWrappedData(token);
      notesAPI.getAll(actualToken).then((response) => {
        const actualDeletedId = GeneralUtils.getWrappedData(deletedId);
        const remainingNotes = response.body.data;
        const deletedNoteExists = remainingNotes.some(
          (note: Note) => note.id === (actualDeletedId)
        );
        expect(deletedNoteExists).to.be.false;
      });
    });
  });
});

Then("all other notes should remain intact in the list", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@createdNotes").then((originalNotes) => {
      cy.get("@deletedNoteId").then((deletedId) => {
        const actualToken = GeneralUtils.getWrappedData(token);
        const createdNotes = GeneralUtils.getWrappedData(originalNotes);
        const actualDeletedId = GeneralUtils.getWrappedData(deletedId);

        notesAPI.getAll(actualToken).then((response) => {
          const remainingNotes = response.body.data;
          expect(remainingNotes).to.have.length(createdNotes.length - 1);

          const remainingIds = remainingNotes.map((note: Note) => note.id);
          createdNotes
            .filter((note: { id: string; }) => note.id !== (actualDeletedId))
            .forEach((note: { id: any; }) => {
              expect(remainingIds).to.include(note.id);
            });
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
