import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { notesAPI } from "../../../../e2e/api/notes/NotesAPI";
import { Note } from "../../../../e2e/api/notes/types/note";
import { NoteCreate } from "../../../../e2e/api/notes/types/noteCreate";
import { testDataAPI } from "../../../../e2e/api/support/TestDataAPI";
import { GeneralUtils } from "../../../utilities/GeneralUtils";

Given("no user is authenticated", () => {
  cy.wrap(null).as("authToken");
});

Given("a valid user {string} is authenticated", (userLabel: string) => {
  testDataAPI.createUserAndGetToken().as(`authToken${userLabel}`);
});

Given("a different user {string} has existing notes", (userLabel: string) => {
  testDataAPI.createUserAndGetToken().then((token: string) => {
    cy.wrap(token).as(`authToken${userLabel}`);

    const userBNotes: NoteCreate[] = [
      testDataAPI.generateNote({
        title: `User ${userLabel} - Private Note 1`,
        description: `This is a private note belonging to user ${userLabel}`,
      }),
      testDataAPI.generateNote({
        title: `User ${userLabel} - Confidential Note 2`,
        description: `Confidential information for user ${userLabel} only`,
      }),
      testDataAPI.generateNote({
        title: `User ${userLabel} - Personal Task`,
        description: `Personal task list for user ${userLabel}`,
      }),
    ];

    testDataAPI.createMultipleNotes(token, userBNotes.length).then((notes) => {
      cy.wrap(notes).as(`user${userLabel}Notes`);
    });
  });
});

When("a request is made to retrieve notes", () => {
  cy.get("@authToken").then((token) => {
    const actualToken = GeneralUtils.getWrappedData(token);
    if (token === null) {
      cy.request({
        method: "GET",
        url: `${Cypress.env("notes_url")}`,
        failOnStatusCode: false,
      }).as("apiResponse");
    } else {
      notesAPI.getAll(actualToken).as("apiResponse");
    }
  });
});

When(
  "a request is made to retrieve notes for user {string}",
  (userLabel: string) => {
    cy.get("@authTokenA").then((tokenA) => {
      const actualTokenA = GeneralUtils.getWrappedData(tokenA);
      // User A trying to access their own notes (should work for baseline)
      notesAPI.getAll(actualTokenA).as("apiResponse");
    });
  }
);

When("a request with malformed JSON is sent", () => {
  cy.get("@authToken").then((token) => {
    const actualToken = GeneralUtils.getWrappedData(token);
    cy.request({
      method: "POST",
      url: `${Cypress.env("notes_url")}`,
      headers: {
        Authorization: `Bearer ${actualToken}`,
        "Content-Type": "application/json",
      },
      body: '{"title": "Test Note", "description": "Valid desc", "malformed": }',
      failOnStatusCode: false,
    }).as("apiResponse");
  });
});

When(
  "a request is made to create a note with content exceeding the limit",
  () => {
    cy.get("@authToken").then((token) => {
      const actualToken = GeneralUtils.getWrappedData(token);
      const extremelyLongContent = "A".repeat(10000);
      const oversizedNote: NoteCreate = testDataAPI.generateNote({
        title: extremelyLongContent,
        description: extremelyLongContent,
      });

      notesAPI.create(actualToken, oversizedNote).then((response) => {
        cy.wrap(response).as("apiResponse");
      });
    });
  }
);

When("multiple notes are created in sequence", () => {
  cy.get("@authToken").then((token) => {
    const actualToken = GeneralUtils.getWrappedData(token);
    const startTime = Date.now();
    const bulkNotes: NoteCreate[] = Array.from({ length: 10 }, (_, i) =>
      testDataAPI.generateNote({
        title: `Bulk Note ${i + 1}`,
        description: `This is bulk note number ${i + 1} for performance testing`,
      })
    );

    cy.wrap(startTime).as("startTime");
    const results: any[] = [];

    bulkNotes.reduce(
      (chain: Cypress.Chainable<any>, note: NoteCreate, index: number) => {
        return chain.then(() => {
          return notesAPI.create(actualToken, note).then((response) => {
            const responseTime = Date.now() - startTime;
            results.push({ response, responseTime, index });
          });
        });
      },
      cy.wrap(null) // This is the initial value for the accumulator
    ).then(() => {
      cy.wrap(results).as("bulkCreationResults");
    });
  });
});

Then("the response body should indicate an authentication error", () => {
  cy.get("@apiResponse").then((response) => {
    const actualResponse = notesAPI.normalizeResponse(response);
    expect(actualResponse.body).to.have.property("error");
    expect(actualResponse.body.error.toLowerCase()).to.include("unauthorized");
  });
});

Then(
  "the response must not contain any notes of user {string}",
  (userLabel: string) => {
    cy.get("@apiResponse").then((response) => {
      const actualResponse = notesAPI.normalizeResponse(response);
      cy.get(`@user${userLabel}Notes`).then((userBNotes) => {
        const actualUserBNotes = GeneralUtils.getWrappedData(userBNotes);
        const retrievedNotes: Note[] = actualResponse.body.data;
        const userBNoteIds = actualUserBNotes.map(
          (note: { id: any }) => note.id
        );

        // Verify none of user B's notes are in user A's response
        retrievedNotes.forEach((note: Note) => {
          expect(userBNoteIds).to.not.include(note.id);
        });
      });
    });
  }
);

Then("the response should indicate an invalid request format", () => {
  cy.get("@apiResponse").then((response) => {
    const actualResponse = notesAPI.normalizeResponse(response);
    expect(actualResponse.body).to.have.property("message");
    expect(actualResponse.body.message).to.be.eq('Unexpected token } in JSON at position 65');
  });
});

Then(
  "all create operations should respond with {int}",
  (statusCode: number) => {
    cy.get("@bulkCreationResults").then((results) => {
      const actualResults = GeneralUtils.getWrappedData(results);
      actualResults.forEach((result: { response: { status: number; }; }) => {
        expect(result.response.status).to.equal(statusCode);
      });
    });
  }
);

Then(
  "the response times should remain within acceptable performance limits",
  () => {
    cy.get("@bulkCreationResults").then((results) => {
      const actualResults = GeneralUtils.getWrappedData(results);
      const acceptableResponseTime = 5000; // 5 seconds max per operation
      const averageResponseTime =
        actualResults.reduce((sum: any, result: { responseTime: any; }) => sum + result.responseTime, 0) /
        actualResults.length;

      // Check individual response times
      actualResults.forEach((result: { responseTime: any; }, index: number) => {
        expect(
          result.responseTime,
          `Note ${index + 1} response time`
        ).to.be.lessThan(acceptableResponseTime);
      });

      // Check average response time
      expect(averageResponseTime, "Average response time").to.be.lessThan(
        acceptableResponseTime / 2
      );

      cy.log(`Average response time: ${averageResponseTime}ms`);
      cy.log(
        `Max response time: ${Math.max(
          ...actualResults.map((r: { responseTime: any; }) => r.responseTime)
        )}ms`
      );
    });
  }
);

afterEach(() => {
  testDataAPI.cleanup();
});
