import { BasePage } from "./BasePage";

class LoginPage extends BasePage {
  
  private static instance: LoginPage;
  #username: string;
  #password: string;
  
  private constructor(username: string, password: string) {
    super();
    this.#username = username;
    this.#password = password;
  }

  public static getInstance(): LoginPage {
    if (!LoginPage.instance) {
      LoginPage.instance = new LoginPage("", "");
    }
    return LoginPage.instance;
  }

  #setValidUsernameFromPage() {
    cy.get(`#core`).find(`ul > li`).contains('Username:').invoke('text').then((text) => {
      this.#username = text.toString().replace(/Username:/g, '').trim();    
    });
    return this.#username;
  }

  #setValidPasswordFromPage() {
    cy.get(`#core`).find(`ul > li`).contains('Password:').invoke('text').then((text) => {
        this.#password = text.toString().replace(/Password:/g, '').trim();
    });
    return this.#password;
  }

  getUsername(): string {
    return (this.#username === "") ? this.#setValidUsernameFromPage() : this.#username;
  }

  getPassword() {
    return (this.#password === "") ? this.#setValidPasswordFromPage() : this.#password;
  }

  visit() {
    cy.visit('/login');
    this.#setValidUsernameFromPage();
    this.#setValidPasswordFromPage();
  }

  submit() {
    cy.get(`#login > button`).click();
  }

  verifyPageLoaded() {
    cy.url().should('eq', `${Cypress.config().baseUrl}/login`);
    cy.shouldExistAndBeVisible('#username');
    cy.shouldExistAndBeVisible('#password');
    cy.shouldExistAndBeVisible('#login > button');
  }

  verifyEmptyUsername() {
    cy.get(`#username`).invoke('val').should('have.lengthOf', 0);
  }

  verifyEmptyPassword() {
    cy.get(`#password`).invoke('val').should('have.lengthOf', 0);
  }
}

export const loginPage = LoginPage.getInstance();