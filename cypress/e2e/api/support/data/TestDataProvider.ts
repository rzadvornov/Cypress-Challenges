import { NoteCreate } from "../../notes/types/noteCreate";
import { UserCreate } from "../types/userCreate";
import { PlaceholderReplacer } from "./PlaceholderReplacer";

export class TestDataProvider {
  constructor(private placeholderReplacer: PlaceholderReplacer) {}

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
   * Generates test note data programmatically.
   * @param overrides - Properties to override the default note.
   * @returns A NoteCreate object.
   */
  public generateNote(overrides: Partial<NoteCreate> = {}): NoteCreate {
    const timestamp = Date.now();
    const defaultNote: NoteCreate = {
      title: `Test Note ${timestamp}`,
      description: `This is a test note created at ${new Date().toISOString()}`,
      category: "Personal",
      completed: false,
    };
    return { ...defaultNote, ...overrides };
  }

  /**
   * Gets programmatically generated invalid data for negative testing.
   */
  public getProgrammaticInvalidData() {
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
   * Provides a structured collection of invalid data scenarios from fixtures for negative testing.
   */
  getInvalidDataFromFixtures() {
    const userData = require("../../../../fixtures/invalidUserData.json");
    const noteData = require("../../../../fixtures/invalidNoteData.json");
    const apiData = require("../../../../fixtures/invalidApiData.json");
    
    this.placeholderReplacer.replacePlaceholder(userData, 'userData', 'longPassword');
    this.placeholderReplacer.replacePlaceholder(noteData, 'noteData', 'longTitle');
    this.placeholderReplacer.replacePlaceholder(apiData, 'apiData', 'extremelyLargePayload');

    return {
      user: userData,
      note: noteData,
      api: apiData,
    };
  }

  /**
   * Provides a structured collection of valid data scenarios from fixtures for positive testing.
   */
  getValidDataFromFixtures() {
    const noteData = require("../../../../fixtures/noteData.json");
    
    this.placeholderReplacer.replacePlaceholder(noteData, 'noteData', 'validNote');
    this.placeholderReplacer.replacePlaceholder(noteData, 'noteData', 'titleOnlyNote');
    
    return {
      note: noteData,
    };
  }

  /**
   * Gets a specific valid note from fixtures with placeholders replaced.
   * @param noteType - The type of note to get (e.g., 'validNote', 'titleOnlyNote')
   */
  getNoteFromFixture(noteType: string): NoteCreate {
    const noteData = require("../../../../fixtures/noteData.json");
    
    if (!noteData[noteType]) {
      throw new Error(`Note type '${noteType}' not found in fixtures`);
    }

    const note = { ...noteData[noteType] };
    
    // Replace placeholders if they exist
    if (noteType === 'validNote' || noteType === 'titleOnlyNote') {
      this.placeholderReplacer.replacePlaceholder({ [noteType]: note }, 'noteData', noteType as any);
    }

    return note;
  }

  /**
   * Gets all valid notes from fixtures with placeholders replaced.
   */
  getAllNotesFromFixtures(): Record<string, NoteCreate> {
    const noteData = require("../../../../fixtures/noteData.json");
    const result: Record<string, NoteCreate> = {};

    for (const [noteType, note] of Object.entries(noteData)) {
      const noteCopy = { ...note as NoteCreate };
      
      // Replace placeholders for specific note types
      if (noteType === 'validNote' || noteType === 'titleOnlyNote') {
        const tempObj = { [noteType]: noteCopy };
        this.placeholderReplacer.replacePlaceholder(tempObj, 'noteData', noteType as any);
      }
      
      result[noteType] = noteCopy;
    }

    return result;
  }
}