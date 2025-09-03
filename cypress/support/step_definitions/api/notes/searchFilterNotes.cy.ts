import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { testDataAPI } from "../../../../e2e/api/support/TestDataAPI";
import { notesAPI } from "../../../../e2e/api/notes/NotesAPI";
import { GeneralUtils } from "../../../utilities/GeneralUtils";
import { Note } from "../../../../e2e/api/notes/types/note";
import { NoteCreate } from "../../../../e2e/api/notes/types/noteCreate";

Given("the user has created multiple notes with different content", () => {
  cy.get("@authToken").then((token) => {
    const diverseNotes: NoteCreate[] = [
      testDataAPI.generateNote({
        title: "Work Meeting Notes",
        description: "Important meeting about project planning and deadlines",
      }),
      testDataAPI.generateNote({
        title: "Personal Tasks",
        description: "Shopping list and weekend plans",
      }),
      testDataAPI.generateNote({
        title: "Work Project Ideas",
        description: "Brainstorming session notes for the new feature",
      }),
      testDataAPI.generateNote({
        title: "Vacation Planning",
        description: "Research destinations and book flights",
      }),
    ];
    const actualToken = GeneralUtils.getWrappedData(token);
    testDataAPI
      .createMultipleNotes(actualToken, diverseNotes.length)
      .as("createdNotes");
  });
});

Given("the user has notes with various titles", () => {
  cy.get("@authToken").then((token) => {
    const notesWithVariousTitles: NoteCreate[] = [
      testDataAPI.generateNote({
        title: "Work Meeting Agenda",
        description: "Quarterly review and team updates",
      }),
      testDataAPI.generateNote({
        title: "Personal Work Schedule",
        description: "Weekly planning and task prioritization",
      }),
      testDataAPI.generateNote({
        title: "Family Dinner Plans",
        description: "Menu planning for the weekend",
      }),
      testDataAPI.generateNote({
        title: "Work Project Deadline",
        description: "Important milestones and deliverables",
      }),
    ];

    const actualToken = GeneralUtils.getWrappedData(token);
    notesAPI
      .createMultiple(actualToken, notesWithVariousTitles)
      .then((responses) => {
        const notes = responses.map((response) => response.body.data);
        cy.wrap(notes).as("notesWithTitles");
      });
  });
});

Given("the user has notes with various descriptions", () => {
  cy.get("@authToken").then((token) => {
    const notesWithVariousDescriptions: NoteCreate[] = [
      testDataAPI.generateNote({
        title: "Team Updates",
        description: "Weekly meeting with stakeholders and project review",
      }),
      testDataAPI.generateNote({
        title: "Project Planning",
        description: "Strategic meeting for Q4 objectives and goals",
      }),
      testDataAPI.generateNote({
        title: "Personal Tasks",
        description: "Grocery shopping and household chores",
      }),
      testDataAPI.generateNote({
        title: "Research Notes",
        description: "Important meeting findings and action items",
      }),
    ];

    const actualToken = GeneralUtils.getWrappedData(token);
    notesAPI
      .createMultiple(actualToken, notesWithVariousDescriptions)
      .then((responses) => {
        const notes = responses.map((response) => response.body.data);
        cy.wrap(notes).as("notesWithDescriptions");
      });
  });
});

Given("the user has both completed and pending notes", () => {
  cy.get("@authToken").then((token) => {
    const actualToken = GeneralUtils.getWrappedData(token);
    testDataAPI.createNotesWithMixedStatus(actualToken).as("mixedStatusNotes");
  });
});

When(
  "a search is performed for the title keyword {string}",
  (keyword: string) => {
    cy.get("@authToken").then((token) => {
      const actualToken = GeneralUtils.getWrappedData(token);
      notesAPI.search(actualToken, keyword).as("apiResponse");
      cy.wrap(keyword).as("searchKeyword");
    });
  }
);

When(
  "a search is performed for the description keyword {string}",
  (keyword: string) => {
    cy.get("@authToken").then((token) => {
      const actualToken = GeneralUtils.getWrappedData(token);
      notesAPI.search(actualToken, keyword).as("apiResponse");
      cy.wrap(keyword).as("descriptionKeyword");
    });
  }
);

When(
  "a search is performed with a unique keyword that does not match any note",
  () => {
    cy.get("@authToken").then((token) => {
      const actualToken = GeneralUtils.getWrappedData(token);
      const uniqueKeyword = `unique_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      notesAPI.search(actualToken, uniqueKeyword).as("apiResponse");
      cy.wrap(uniqueKeyword).as("uniqueKeyword");
    });
  }
);

When("a filter is applied for the {string} status", (status: string) => {
  cy.get("@authToken").then((token) => {
    const isCompleted = status === "completed";
    const actualToken = GeneralUtils.getWrappedData(token);
    notesAPI.filterByCompletion(actualToken, isCompleted).as("filterResponse");
    cy.wrap(isCompleted).as("filterStatus");
  });
});

Then(
  "the response should only contain notes with {string} in the title",
  (keyword: string) => {
    cy.get("@apiResponse").then((response) => {
      const actualResponse = notesAPI.normalizeResponse(response);
      const notes: Note[] = actualResponse.body.data;
      expect(notes).to.be.an("array");

      notes.forEach((note: Note) => {
        expect(note.title.toLowerCase()).to.include(keyword.toLowerCase());
      });

      cy.wrap(notes).as("filteredNotes");
    });
  }
);

Then("notes without the keyword should not be present in the results", () => {
  cy.get("@apiResponse").then((response) => {
    cy.get("@searchKeyword").then((keyword) => {
      const actualResponse = notesAPI.normalizeResponse(response);
      const notes: Note[] = actualResponse.body.data;
      const actualKeyword = GeneralUtils.getWrappedData(keyword);
      const notesWithoutKeyword = notes.filter(
        (note: Note) =>
          !note.title.toLowerCase().includes(actualKeyword.toLowerCase())
      );
      expect(notesWithoutKeyword).to.have.length(0);
    });
  });
});

Then(
  "the response should only contain notes that contain {string} in the description",
  (keyword: string) => {
    cy.get("@apiResponse").then((response) => {
      const actualResponse = notesAPI.normalizeResponse(response);
      const notes: Note[] = actualResponse.body.data;
      expect(notes).to.be.an("array");

      notes.forEach((note: Note) => {
        expect(note.description.toLowerCase()).to.include(
          keyword.toLowerCase()
        );
      });
    });
  }
);

Then("the result set should be empty", () => {
  cy.get("@apiResponse").then((response) => {
    const actualResponse = notesAPI.normalizeResponse(response);
    const notes: Note[] = actualResponse.body.data;
    expect(notes).to.be.an("array").and.have.length(0);
  });
});

Then(
  "the response should only contain notes with a status of {string}",
  (status: string) => {
    cy.get("@filterResponse").then((response) => {
      const actualResponse = notesAPI.normalizeResponse(response);
      const notes: Note[] = actualResponse.body.data;
      const expectedStatus = status === "completed";

      expect(notes).to.be.an("array");
      notes.forEach((note: Note) => {
        expect(note.completed).to.equal(expectedStatus);
      });
    });
  }
);

Then("no pending notes should be present in the results", () => {
  cy.get("@filterResponse").then((response) => {
    const actualResponse = notesAPI.normalizeResponse(response);
    const notes: Note[] = actualResponse.body.data;
    const pendingNotes = notes.filter((note: Note) => !note.completed);
    expect(pendingNotes).to.have.length(0);
  });
});

afterEach(() => {
  testDataAPI.cleanup();
});
