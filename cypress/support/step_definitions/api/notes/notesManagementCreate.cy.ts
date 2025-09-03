import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import StatusCode from "status-code-enum";
import { testDataAPI } from "../../../../e2e/api/support/TestDataAPI";
import { notesAPI } from "../../../../e2e/api/notes/NotesAPI";
import { GeneralUtils } from "../../../utilities/GeneralUtils";

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
  const incompleteData = {};
  cy.wrap(incompleteData).as("noteData");
});

When("the user creates a new note", () => {
  cy.get("@authToken").then((token) => {
    cy.get("@noteData").then((noteData) => {
      const actualToken = GeneralUtils.getWrappedData(token);
      const actualNoteData = GeneralUtils.getWrappedData(noteData);
      notesAPI
        .create(actualToken, actualNoteData)
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
      const actualToken = GeneralUtils.getWrappedData(token);
      const actualNoteData = GeneralUtils.getWrappedData(noteData);
      notesAPI.create(actualToken, actualNoteData).then((response) => {
        cy.wrap(response).as("apiResponse");
      });
    });
  });
});

Then("the response should include the note ID", () => {
  cy.get("@createdNote").then((note) => {
    const createdNote = GeneralUtils.getWrappedData(note);
    expect(createdNote).to.have.property("id");
    expect(createdNote.id).to.be.a("string").and.not.be.empty;
  });
});

Then("the note should contain the provided title and description", () => {
  cy.get("@createdNote").then((note) => {
    cy.get("@noteData").then((noteData) => {
      const createdNote = GeneralUtils.getWrappedData(note);
      const originalData = GeneralUtils.getWrappedData(noteData);
      expect(createdNote.title).to.equal(originalData.title);
      expect(createdNote.description).to.equal(originalData.description);
    });
  });
});

Then("the note should have a creation timestamp", () => {
  cy.get("@createdNote").then((note) => {
    const createdNote = GeneralUtils.getWrappedData(note);
    expect(createdNote).to.have.property("created_at");
    expect(createdNote).to.have.property("updated_at");
    expect(new Date(createdNote.created_at)).to.be.instanceOf(Date);
    expect(new Date(createdNote.updated_at)).to.be.instanceOf(Date);
  });
});

Then("the note description should be empty or null", () => {
  cy.get("@createdNote").then((note) => {
    const createdNote = GeneralUtils.getWrappedData(note);
    expect(createdNote.description).to.satisfy(
      (desc: string) => desc === "" || desc === null || desc === undefined
    );
  });
});

Then("the error should specify missing title field", () => {
  cy.get("@apiResponse").then((response) => {
    const actualResponse = notesAPI.normalizeResponse(response);
    expect(actualResponse.body).to.have.property("message");
    expect(actualResponse.body.message).to.be.eq(
      "Title must be between 4 and 100 characters"
    );
  });
});

Then("the error should specify missing description field", () => {
  cy.get("@apiResponse").then((response) => {
    const actualResponse = notesAPI.normalizeResponse(response);
    expect(actualResponse.body).to.have.property("message");
    expect(actualResponse.body.message).to.be.eq(
      "Description must be between 4 and 1000 characters"
    );
  });
});

Then("the response status code should be {int}", (statusCodeNumber: number) => {
  cy.get("@apiResponse").then((response) => {
    const actualResponse = notesAPI.normalizeResponse(response);

    const expectedStatusName = Object.keys(StatusCode).find(
      (key) => StatusCode[key as keyof typeof StatusCode] === statusCodeNumber
    );

    if (expectedStatusName) {
      const expectedStatusCode =
        StatusCode[expectedStatusName as keyof typeof StatusCode];
      expect(actualResponse.status).to.equal(expectedStatusCode);
    } else {
      throw new Error(
        `Status code ${statusCodeNumber} not found in StatusCode enum.`
      );
    }
  });
});

afterEach(() => {
  if (testDataAPI) {
    testDataAPI.cleanup();
  }
});
