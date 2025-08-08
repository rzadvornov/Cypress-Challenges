import { BasePage } from "./BasePage";
import { Singleton } from "../../../support/utilities/Decorators";

@Singleton
class LoginPage extends BasePage {
  
  protected loginElements = {
    coreContainer: () => cy.get('#core'),
    credentialsListItems: () => cy.get('#core').find('ul > li'),
    usernameListItem: () => cy.get('#core').find('ul > li').contains('Username:'),
    passwordListItem: () => cy.get('#core').find('ul > li').contains('Password:'),
    submitButton: () => cy.get('#login > button')
  };

  #username: string;
  #password: string;
  
  constructor(username: string, password: string) {
    super();
    this.#username = username;
    this.#password = password;
  }

  #setValidUsernameFromPage() {
    this.loginElements.usernameListItem().invoke('text').then((text) => {
      this.#username = text.toString().replace(/Username:/g, '').trim();    
    });
    return this.#username;
  }

  #setValidPasswordFromPage() {
    this.loginElements.passwordListItem().invoke('text').then((text) => {
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
    this.loginElements.submitButton().click();
  }

  verifyPageLoaded() {
    cy.url().should('eq', `${Cypress.config().baseUrl}/login`);
    
    this.elements.username()
      .should('exist')
      .and('be.visible');
    
    this.elements.password()
      .should('exist')
      .and('be.visible');
    
    this.loginElements.submitButton()
      .should('exist')
      .and('be.visible');
  }

  verifyEmptyUsername() {
    this.elements.username().invoke('val').should('have.lengthOf', 0);
  }

  verifyEmptyPassword() {
    this.elements.password().invoke('val').should('have.lengthOf', 0);
  }
}

export const loginPage = new LoginPage("", "");