import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { testDataAPI } from "../../../../e2e/api/support/TestDataAPI";
import { notesAPI } from "../../../../e2e/api/notes/NotesAPI";
import { GeneralUtils } from "../../../utilities/GeneralUtils";
import { Note } from "../../../../e2e/api/notes/types/note";

Given(
  "the user has an existing note with a {string} status",
  (status: "pending" | "completed") => {
    const isCompleted = status === "completed";
    const noteData = testDataAPI.generateNote({ completed: isCompleted });

    cy.get("@authToken").then((token) => {
      const actualToken = GeneralUtils.getWrappedData(token);
      testDataAPI.createNote(actualToken, noteData).then((note: Note) => {
        cy.wrap(note).as("currentNote");
        cy.wrap(note.completed).as("originalStatus");

        expect(note.completed).to.eq(isCompleted);
        cy.log(`Created ${status} note: ${note.id}`);
      });
    });
  }
);

Given("the user has an existing note with a known status", () => {
  const isCompleted = Math.random() > 0.5;
  const noteData = testDataAPI.generateNote({ completed: isCompleted });

  cy.get("@authToken").then((token) => {
    const actualToken = GeneralUtils.getWrappedData(token);
    testDataAPI.createNote(actualToken, noteData).then((note: Note) => {
      cy.wrap(note).as("currentNote");
      cy.wrap(note.completed).as("originalStatus");

      cy.log(
        `Created note with status: ${note.completed ? "completed" : "pending"}`
      );
    });
  });
});

When(
  "a request is made to update the note's status to {string}",
  (status: "completed" | "pending") => {
    cy.wrap(new Date().toISOString()).as("testTimestamp");

    cy.get("@authToken").then((token) => {
      cy.get("@currentNote").then((note) => {
        const actualToken = GeneralUtils.getWrappedData(token);
        const actualNote = GeneralUtils.getWrappedData(note);
        const isCompleted = status === "completed";
        notesAPI
          .toggleCompletion(actualToken, actualNote.id, isCompleted)
          .then((response) => {
            cy.wrap(response).as("apiResponse");
          });
      });
    });
  }
);

When("a request is made to toggle the note's completion status", () => {
  cy.wrap(new Date().toISOString()).as("testTimestamp");

  cy.get("@authToken").then((token) => {
    cy.get("@currentNote").then((note) => {
      cy.get("@originalStatus").then((originalStatus) => {
        const actualToken = GeneralUtils.getWrappedData(token);
        const actualNote = GeneralUtils.getWrappedData(note);
        const newStatus = !GeneralUtils.getWrappedData(originalStatus);
        notesAPI
          .toggleCompletion(actualToken, actualNote.id, newStatus)
          .then((response) => {
            cy.wrap(response).as("apiResponse");
          });
      });
    });
  });
});

Then(
  "the note's status should be {string}",
  (status: "completed" | "pending") => {
    const isCompleted = status === "completed";

    cy.get("@apiResponse").then((response) => {
      const actualResponse = notesAPI.normalizeResponse(response);
      const updatedNote = actualResponse.body.data;

      expect(updatedNote.completed).to.eq(isCompleted);

      cy.get("@authToken").then((token) => {
        const actualToken = GeneralUtils.getWrappedData(token);
        notesAPI.getById(actualToken, updatedNote.id).then((fetchResponse) => {
          expect(fetchResponse.body.data.completed).to.eq(isCompleted);
        });
      });
    });
  }
);

Then(
  "the note's updated_at timestamp should be set to the current time",
  () => {
    cy.get("@apiResponse").then((response) => {
      const actualResponse = notesAPI.normalizeResponse(response);
      const updatedNote = actualResponse.body.data;
      validateTimestamp(updatedNote, "updated_at");
    });
  }
);

Then("the note's status should be the opposite of its previous state", () => {
  cy.get('@apiResponse').then((response) => {
    const actualResponse = notesAPI.normalizeResponse(response);
    const updatedNote = actualResponse.body.data;
    
    cy.get('@originalStatus').then((originalStatus) => {

      const expectedStatus = !GeneralUtils.getWrappedData(originalStatus);
      expect(updatedNote.completed).to.equal(expectedStatus);
      
      cy.get('@authToken').then((token) => {
        const actualToken = GeneralUtils.getWrappedData(token);
        notesAPI.getById(actualToken, updatedNote.id).then((fetchResponse) => {
          expect(fetchResponse.body.data.completed).to.equal(expectedStatus);
        });
      });
    });
  });
});

const validateTimestamp = (updatedNote: Note, key: "updated_at") => {
  expect(updatedNote[key]).to.not.be.null;

  cy.get("@testTimestamp").then((testStartTime) => {
    const actualTestTimestamp = GeneralUtils.getWrappedData(testStartTime);
    const noteTimestamp = new Date(updatedNote[key] as string);
    const startTime = new Date(actualTestTimestamp);
    const timeDifference = Math.abs(
      noteTimestamp.getTime() - startTime.getTime()
    );

    expect(timeDifference).to.be.lessThan(5000);
  });
};

afterEach(() => {
  if (testDataAPI) {
    testDataAPI.cleanup();
  }
});
