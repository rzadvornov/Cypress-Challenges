import { Note, NoteCreate, NoteUpdate } from "./note";
import { BaseAPI } from "../BaseAPI";
import { HTTPMethod } from "http-method-enum";
import { StatusCode } from "status-code-enum";

export class NotesAPI extends BaseAPI {
  /**
   * Create a new note
   * @param {string} token - Auth token
   * @param {NoteCreate} noteData - Note data
   * @returns {Cypress.Chainable<Cypress.Response<Note>>} - Create response
   */
  create(
    token: string,
    noteData: NoteCreate
  ): Cypress.Chainable<Cypress.Response<Note>> {
    return this.request({
      method: HTTPMethod.POST,
      url: `${Cypress.env("notes_url")}`,
      body: noteData,
      headers: this.getAuthHeaders(token),
    });
  }

  /**
   * Get all notes for authenticated user
   * @param {string} token - Auth token
   * @param {URLSearchParams} queryParams - Optional query parameters
   * @returns {Cypress.Chainable<Cypress.Response<{ data: Note[] }>>} - Notes list response
   */
  getAll(
    token: string,
    queryParams: Record<string, string | number | boolean> = {}
  ): Cypress.Chainable<Cypress.Response<{ data: Note[] }>> {
    const queryString = new URLSearchParams(
      queryParams as Record<string, string>
    ).toString();
    const url = queryString
      ? `${Cypress.env("notes_url")}?${queryString}`
      : `${Cypress.env("notes_url")}`;

    return this.request({
      method: HTTPMethod.GET,
      url: url,
      headers: this.getAuthHeaders(token),
    });
  }

  /**
   * Get a specific note by ID
   * @param {string} token - Auth token
   * @param {string} noteId - Note ID
   * @returns {Cypress.Chainable<Cypress.Response<{ data: Note }>>} - Note response
   */
  getById(
    token: string,
    noteId: string
  ): Cypress.Chainable<Cypress.Response<{ data: Note }>> {
    return this.request({
      method: HTTPMethod.GET,
      url: `${Cypress.env("notes_url")}/${noteId}`,
      headers: this.getAuthHeaders(token),
    });
  }

  /**
   * Update a note completely
   * @param {string} token - Auth token
   * @param {string} noteId - Note ID
   * @param {NoteUpdate} noteData - Updated note data
   * @returns {Cypress.Chainable<Cypress.Response<{ data: Note }>>} - Update response
   */
  update(
    token: string,
    noteId: string,
    noteData: NoteUpdate
  ): Cypress.Chainable<Cypress.Response<{ data: Note }>> {
    return this.request({
      method: HTTPMethod.PUT,
      url: `${Cypress.env("notes_url")}/${noteId}`,
      body: noteData,
      headers: this.getAuthHeaders(token),
    });
  }

  /**
   * Partially update a note
   * @param {string} token - Auth token
   * @param {string} noteId - Note ID
   * @param {Partial<NoteUpdate>} noteData - Partial note data
   * @returns {Cypress.Chainable<Cypress.Response<{ data: Note }>>} - Update response
   */
  patch(
    token: string,
    noteId: string,
    noteData: Partial<NoteUpdate>
  ): Cypress.Chainable<Cypress.Response<{ data: Note }>> {
    return this.request({
      method: HTTPMethod.PATCH,
      url: `${Cypress.env("notes_url")}/${noteId}`,
      body: noteData,
      headers: this.getAuthHeaders(token),
    });
  }

  /**
   * Delete a note
   * @param {string} token - Auth token
   * @param {string} noteId - Note ID
   * @returns {Cypress.Chainable<Cypress.Response<void>>} - Delete response
   */
  delete(
    token: string,
    noteId: string
  ): Cypress.Chainable<Cypress.Response<void>> {
    return this.request({
      method: HTTPMethod.DELETE,
      url: `${Cypress.env("notes_url")}/${noteId}`,
      headers: this.getAuthHeaders(token),
    });
  }

  /**
   * Search notes
   * @param {string} token - Auth token
   * @param {string} searchTerm - Search term
   * @param {Record<string, string>} additionalParams - Additional search parameters
   * @returns {Cypress.Chainable<Cypress.Response<{ data: Note[] }>>} - Search response
   */
  search(
    token: string,
    searchTerm: string,
    additionalParams: Record<string, string> = {}
  ): Cypress.Chainable<Cypress.Response<{ data: Note[] }>> {
    const queryParams = {
      search: searchTerm,
      ...additionalParams,
    };
    return this.getAll(token, queryParams);
  }

  /**
   * Filter notes by completion status
   * @param {string} token - Auth token
   * @param {boolean} completed - Completion status
   * @returns {Cypress.Chainable<Cypress.Response<{ data: Note[] }>>} - Filter response
   */
  filterByCompletion(
    token: string,
    completed: boolean
  ): Cypress.Chainable<Cypress.Response<{ data: Note[] }>> {
    return this.getAll(token, { completed });
  }

  /**
   * Filter notes by date range
   * @param {string} token - Auth token
   * @param {string} fromDate - Start date (ISO string)
   * @param {string} toDate - End date (ISO string)
   * @returns {Cypress.Chainable<Cypress.Response<{ data: Note[] }>>} - Filter response
   */
  filterByDateRange(
    token: string,
    fromDate: string,
    toDate: string
  ): Cypress.Chainable<Cypress.Response<{ data: Note[] }>> {
    return this.getAll(token, {
      from: fromDate,
      to: toDate,
    });
  }

  /**
   * Toggle note completion status
   * @param {string} token - Auth token
   * @param {string} noteId - Note ID
   * @param {boolean} completed - New completion status
   * @returns {Cypress.Chainable<Cypress.Response<{ data: Note }>>} - Update response
   */
  toggleCompletion(
    token: string,
    noteId: string,
    completed: boolean
  ): Cypress.Chainable<Cypress.Response<{ data: Note }>> {
    return this.patch(token, noteId, { completed });
  }

  /**
   * Create multiple notes
   * @param {string} token - Auth token
   * @param {NoteCreate[]} notesArray - Array of note data objects
   * @returns {Promise<Cypress.Response<Note>[]>} - Array of create responses
   */
  createMultiple(
    token: string,
    notesArray: NoteCreate[]
  ): Promise<Cypress.Response<Note>[]> {
    const createPromises = notesArray.map((note) =>
      this.create(token, note).then((response) => response.body.data)
    );
    return Promise.all(createPromises);
  }

  /**
   * Delete multiple notes
   * @param {string} token - Auth token
   * @param {string[]} noteIds - Array of note IDs
   * @returns {Promise<Cypress.Response<void>[]>} - Array of delete responses
   */
  deleteMultiple(
    token: string,
    noteIds: string[]
  ): Promise<Cypress.Response<void>[]> {
    const deletePromises = noteIds.map((noteId) => this.delete(token, noteId));
    return Promise.all(deletePromises);
  }

  /**
   * Clean up all notes for a user
   * @param {string} token - Auth token
   * @returns {Cypress.Chainable<Cypress.Response<void>[] | null>} - Cleanup result
   */
  cleanup(token: string): Cypress.Chainable<Cypress.Response<void>[] | null> {
    return this.getAll(token).then((response) => {
      if (response.body.data && response.body.data.length > 0) {
        const noteIds = response.body.data.map((note: Note) => note.id);
        return this.deleteMultiple(token, noteIds) as any;
      }
      return cy.wrap(null);
    });
  }

  /**
   * Validate note data structure
   * @param {Note} note - Note object
   */
  validateNoteStructure(note: Note): void {
    expect(note).to.have.property("id");
    expect(note).to.have.property("title");
    expect(note).to.have.property("description");
    expect(note).to.have.property("created_at");
    expect(note).to.have.property("updated_at");
    expect(note.id).to.be.a("string").and.not.be.empty;
    expect(note.title).to.be.a("string");
    expect(note.description).to.be.a("string").and.not.be.empty;
    expect(note.created_at).to.be.a("string");
    expect(note.updated_at).to.be.a("string");

    // Validate timestamps are valid dates
    expect(new Date(note.created_at)).to.be.instanceOf(Date);
    expect(new Date(note.updated_at)).to.be.instanceOf(Date);
  }

  /**
   * Validate notes list response
   * @param {Cypress.Response<any>} response - API response
   * @param {number} expectedStatus - Expected status code
   */
  validateNotesListResponse(
    response: Cypress.Response<{ data: Note[] }> | JQuery<HTMLElement>,
    expectedStatus = StatusCode.SuccessOK
  ): void {
    const actualResponse = (response as any).jquery
      ? (response as any)[0]
      : response;
    this.validateResponse(actualResponse, expectedStatus);

    if (expectedStatus === StatusCode.SuccessOK) {
      expect(actualResponse.body.data).to.be.an("array");
      actualResponse.body.data.forEach((note: Note) => {
        this.validateNoteStructure(note);
      });
    }
  }

  /**
   * Validate single note response
   * @param {Cypress.Response<any>} response - API response
   * @param {number} expectedStatus - Expected status code
   */
  validateNoteResponse(
    response: Cypress.Response<{ data: Note }> | JQuery<HTMLElement>,
    expectedStatus = StatusCode.SuccessOK
  ): void {
    const actualResponse = (response as any).jquery
      ? (response as any)[0]
      : response;
    this.validateResponse(actualResponse, expectedStatus);

    if (expectedStatus === StatusCode.SuccessOK) {
      this.validateNoteStructure(actualResponse.body.data);
    }
  }
}
