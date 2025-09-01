import { StatusCode } from "status-code-enum";
import { AuthAPI } from "../notes/AuthAPI";
import { NotesAPI } from "../notes/NotesAPI";
import { Note } from "../notes/types/note";
import { NoteCreate } from "../notes/types/noteCreate";
import { PlaceholderReplacer } from "./data/PlaceholderReplacer";
import { CreatedNote } from "./types/createdNote";
import { CreatedUser } from "./types/createdUser";
import { UserCreate } from "./types/userCreate";
import { TestDataProvider } from "./data/TestDataProvider";
import { ApiResponse } from "../notes/types/apiResponse";

export class TestDataAPI {
  private static instance: TestDataAPI;
  private authAPI: AuthAPI;
  private notesAPI: NotesAPI;
  private createdUsers: CreatedUser[];
  private createdNotes: CreatedNote[];
  private dataProvider: TestDataProvider;
  private placeholderReplacer: PlaceholderReplacer;

  constructor() {
    this.authAPI = new AuthAPI();
    this.notesAPI = new NotesAPI();
    this.createdUsers = [];
    this.createdNotes = [];
    this.placeholderReplacer = new PlaceholderReplacer();
    this.dataProvider = new TestDataProvider(this.placeholderReplacer);
  }

  public static getInstance(): TestDataAPI {
    if (!TestDataAPI.instance) {
      TestDataAPI.instance = new TestDataAPI();
    }
    return TestDataAPI.instance;
  }

  public getCreatedUser(index = 0) {
    return this.createdUsers[index];
  }

  // Delegate methods to data provider
  public generateUser(suffix = ""): UserCreate {
    return this.dataProvider.generateUser(suffix);
  }

  public generateNote(overrides: Partial<NoteCreate> = {}): NoteCreate {
    return this.dataProvider.generateNote(overrides);
  }

  public get data() {
    return this.dataProvider.getProgrammaticInvalidData();
  }

  public getInvalidData() {
    return this.dataProvider.getInvalidDataFromFixtures();
  }

  public getValidData() {
    return this.dataProvider.getValidDataFromFixtures();
  }

  /**
   * Gets a specific note from fixtures
   * @param noteType - The type of note to get
   */
  public getNoteFromFixture(noteType: string): NoteCreate {
    return this.dataProvider.getNoteFromFixture(noteType);
  }

  /**
   * Gets all notes from fixtures
   */
  public getAllNotesFromFixtures(): Record<string, NoteCreate> {
    return this.dataProvider.getAllNotesFromFixtures();
  }

  /**
   * Creates a test user and gets the auth token.
   * @param userData - Optional custom user data.
   * @returns A Cypress chainable of the auth token.
   */
  public createUserAndGetToken(
    userData: UserCreate | null = null
  ): Cypress.Chainable<string> {
    const user = userData || this.generateUser();

    return this.authAPI.registerAndLogin(user).then((token: any) => {
      const authToken = token as string;
      this.createdUsers.push({ token: authToken, userData: user });
      return authToken;
    });
  }

  /**
   * Creates multiple test users.
   * @param count - Number of users to create.
   * @returns A Cypress chainable of an array of auth tokens.
   */
  public createMultipleUsers(count: number): Cypress.Chainable<string[]> {
    const userPromises = Array.from({ length: count }, (_, i) =>
      this.createUserAndGetToken(this.generateUser(`_${i}`))
    );
    return cy.wrap(Promise.all(userPromises));
  }

  /**
   * Creates a test note with authentication.
   * @param token - Auth token for the user.
   * @param noteData - Optional custom note data.
   * @returns A Cypress chainable of the created Note.
   */
  public createNote(
    token: string,
    noteData: NoteCreate = this.generateNote()
  ): Cypress.Chainable<Note> {
    return this.notesAPI
      .create(token, noteData)
      .then((response: Cypress.Response<ApiResponse<Note>>) => {
        if (response.status === StatusCode.SuccessOK) {
          const note = response.body.data;
          this.createdNotes.push({ id: note.id, token });
          return note;
        }

        // Fail gracefully
        cy.log("Note creation failed");
        throw new Error("Note creation failed");
      });
  }

  /**
   * Creates multiple test notes.
   * @param token - Auth token for the user.
   * @param count - Number of notes to create.
   * @returns A Cypress chainable of an array of created notes.
   */
  public createMultipleNotes(
    token: string,
    count: number
  ): Cypress.Chainable<Note[]> {
    const notes = Array.from({ length: count }, () => this.generateNote());

    return this.notesAPI.createMultiple(token, notes).then((responses) => {
      const createdNotes = responses
        .filter((response) => response.status === StatusCode.SuccessOK)
        .map((response) => {
          const note = response.body.data;
          this.createdNotes.push({ id: note.id, token });
          return note;
        });

      if (createdNotes.length === 0) {
        throw new Error("No notes were created successfully");
      }

      return createdNotes;
    });
  }

  /**
   * Creates notes with a mix of completed and pending statuses.
   * @param token - Auth token for the user.
   * @returns An object containing arrays of completed and pending notes.
   */
  public createNotesWithMixedStatus(
    token: string
  ): Cypress.Chainable<{ completed: Note[]; pending: Note[] }> {
    const notes: NoteCreate[] = [
      this.generateNote({ completed: true, title: "Completed Note 1" }),
      this.generateNote({ completed: true, title: "Completed Note 2" }),
      this.generateNote({ completed: false, title: "Pending Note 1" }),
      this.generateNote({ completed: false, title: "Pending Note 2" }),
    ];

    return cy
      .wrap(this.notesAPI.createMultiple(token, notes))
      .then((responses) => {
        const createdNotes = (
          responses as unknown as Cypress.Response<Note>[]
        ).map((response) => {
          const note = response.body.data;
          this.createdNotes.push({ id: note.id, token });
          return note;
        });

        return {
          completed: createdNotes.filter((note) => note.completed),
          pending: createdNotes.filter((note) => !note.completed),
        };
      });
  }

  /**
   * Cleans up all test data (notes and users) created by this instance.
   * @returns A Cypress chainable that resolves after cleanup is complete.
   */
  public cleanup() {
    // Clean up notes
    if (this.createdNotes.length > 0) {
      cy.log(`Cleaning up ${this.createdNotes.length} notes...`);
      this.createdNotes.forEach(({ id, token }) => {
        this.notesAPI.delete(token, id);
      });
    }

    // Clean up users
    if (this.createdUsers.length > 0) {
      cy.log(`Cleaning up ${this.createdUsers.length} users...`);
      this.createdUsers.forEach(({ token }) => {
        this.authAPI.deleteAccount(token);
      });
    }

    // Reset state after Cypress has run all delete commands
    cy.then(() => {
      this.createdNotes = [];
      this.createdUsers = [];
      cy.log("Test data cleanup completed");
    });
  }

  /**
   * Resets the internal state of the test data manager.
   */
  public reset(): void {
    this.createdNotes = [];
    this.createdUsers = [];
  }
}

export const testDataAPI = new TestDataAPI();
