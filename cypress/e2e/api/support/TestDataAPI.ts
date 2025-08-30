import { UserCreate } from "./user";
import { AuthAPI } from "../auth/AuthAPI";
import { NotesAPI } from "../note/NotesAPI";
import { Note, NoteCreate } from "../note/note";
import { StatusCode } from "status-code-enum";

interface CreatedUser {
  token: string;
  userData: UserCreate;
}

interface CreatedNote {
  id: string;
  token: string;
}

export class TestDataAPI {
  private static instance: TestDataAPI;
  private authAPI: AuthAPI;
  private notesAPI: NotesAPI;
  private createdUsers: CreatedUser[];
  private createdNotes: CreatedNote[];

  constructor() {
    this.authAPI = new AuthAPI();
    this.notesAPI = new NotesAPI();
    this.createdUsers = [];
    this.createdNotes = [];
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

  /**
   * Generates unique test user data.
   * @param suffix - Optional suffix for uniqueness.
   * @returns A UserCreate object.
   */
  public generateUser(suffix = ""): UserCreate {
    const timestamp = Date.now();
    return {
      name: `TestUser${timestamp}${suffix}`,
      email: `testuser${timestamp}${suffix}@example.com`,
      password: "SecurePass123!",
    };
  }

  /**
   * Generates test note data.
   * @param overrides - Properties to override the default note.
   * @returns A NoteCreate object.
   */
  public generateNote(overrides: Partial<NoteCreate> = {}): NoteCreate {
    const timestamp = Date.now();
    const defaultNote: NoteCreate = {
      title: `Test Note ${timestamp}`,
      description: `This is a test note created at ${new Date().toISOString()}`,
      completed: false,
    };
    return { ...defaultNote, ...overrides };
  }

  // All static test data is now centralized here
  public get data() {
    return {
      invalid: {
        user: {
          invalidEmail: this.generateUser().email.replace("@", ""),
          emptyName: { ...this.generateUser(), name: "" },
          shortPassword: { ...this.generateUser(), password: "123" },
        },
        note: {
          emptyTitle: this.generateNote({ title: "" }),
          nullTitle: this.generateNote({ title: null as any }),
          longTitle: this.generateNote({ title: "A".repeat(1000) }),
          wrongTypes: { title: 123, description: true, completed: "yes" },
        },
      },
    };
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
    return this.notesAPI.create(token, noteData).then((response) => {
      if (response.status === StatusCode.SuccessOK) {
        const noteId = response.body.data.id;
        this.createdNotes.push({ id: noteId, token: token });
        return response.body.data;
      }
      return cy.log("Note creation failed").then(() => {
        throw new Error("Note creation failed");
      });
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

    return cy
      .then((): Promise<Cypress.Response<Note>[]> => {
        return this.notesAPI.createMultiple(token, notes);
      })
      .then((responses: Cypress.Response<Note>[]): Note[] => {
        const createdNotes = responses
          .filter((response) => response.status === StatusCode.SuccessOK)
          .map((response) => {
            this.createdNotes.push({ id: response.body.data.id, token });
            return response.body.data;
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
        const createdNotes = (responses as Cypress.Response<Note>[]).map(
          (response) => {
            const note = response.body.data;
            this.createdNotes.push({ id: note.id, token });
            return note;
          }
        );

        return {
          completed: createdNotes.filter((note) => note.completed),
          pending: createdNotes.filter((note) => !note.completed),
        };
      });
  }

  /**
   * Provides a structured collection of invalid data scenarios for negative testing.
   * @returns {Object} A comprehensive object containing various invalid data sets.
   */
  getInvalidData() {
    return {
      // Scenarios for user-related endpoints
      user: {
        invalidEmail: {
          name: "Test User",
          email: "invalid-email-format",
          password: "SecurePass123!",
        },
        invalidCredentials: {
          name: "Non Existent User",
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        },
        emptyName: {
          name: "",
          email: "test@example.com",
          password: "SecurePass123!",
        },
        missingFields: {
          // Missing 'name' and 'password' fields
          email: "test@example.com",
        },
        shortPassword: {
          name: "Test User",
          email: "test@example.com",
          password: "123",
        },
        longPassword: {
          name: "Test User",
          email: "test@example.com",
          password: "A".repeat(129), // Example: a password exceeding a common length limit
        },
      },

      // Scenarios for note-related endpoints
      note: {
        nullTitle: {
          title: null,
          description: "Note with a null title",
        },
        emptyTitle: {
          title: "",
          description: "Note with an empty title",
        },
        longTitle: {
          title: "A".repeat(1001), // Assuming a max title length of 1000
          description: "Note with an excessively long title",
        },
        unsupportedDataTypes: {
          title: 12345, // Number instead of string
          description: true, // Boolean instead of string
          completed: "yes", // String instead of boolean
        },
        // Example of an array instead of a string
        titleAsArray: {
          title: ["title array"],
          description: "Note with title as an array",
        },
      },

      // Scenarios for API-level or format-related issues
      api: {
        malformedJson: '{"title": "Test", "description":}', // JSON syntax error
        extremelyLargePayload: {
          title: "Large Payload Test",
          description: "A".repeat(100001), // Assuming a payload size limit
        },
      },
    };
  }

  /**
   * Cleans up all test data (notes and users) created by this instance.
   * @returns A Cypress chainable that resolves after cleanup is complete.
   */
  cleanup() {
    // Clean up notes first
    const noteCleanupPromises = this.createdNotes.map(({ id, token }) =>
      this.notesAPI.delete(token, id).then(() => cy.wrap(null))
    );

    return cy.wrap(Promise.all(noteCleanupPromises)).then(() => {
      // Clean up users (if delete endpoint is available)
      const userCleanupPromises = this.createdUsers.map(({ token }) =>
        this.authAPI.deleteAccount(token).then(() => cy.wrap(null))
      );

      return cy.wrap(Promise.all(userCleanupPromises)).then(() => {
        this.createdNotes = [];
        this.createdUsers = [];
        cy.log("Test data cleanup completed");
      });
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
