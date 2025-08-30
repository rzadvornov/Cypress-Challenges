import { BasePage } from "./BasePage";
import { Singleton } from "../../../support/utilities/Decorators";

@Singleton
class LoginPage extends BasePage {
  private readonly loginSelectors = {
    coreContainer: "#core",
    listItems: "ul > li",
    loginForm: "#login",
    submitButton: "button",
  } as const;

  protected loginElements = {
    coreContainer: () => cy.get(`${this.loginSelectors.coreContainer}`),
    credentialsListItems: () =>
      cy
        .get(`${this.loginSelectors.coreContainer}`)
        .find(`${this.loginSelectors.listItems}`),
    usernameListItem: () =>
      cy
        .get(`${this.loginSelectors.coreContainer}`)
        .find(`${this.loginSelectors.listItems}`)
        .contains("Username:"),
    passwordListItem: () =>
      cy
        .get(`${this.loginSelectors.coreContainer}`)
        .find(`${this.loginSelectors.listItems}`)
        .contains("Password:"),
    submitButton: () =>
      cy
        .get(`${this.loginSelectors.loginForm}`)
        .find(`${this.loginSelectors.submitButton}`),
  };

  #username: string;
  #password: string;

  constructor(username: string, password: string) {
    super();
    this.#username = username;
    this.#password = password;
  }

  #setValidUsernameFromPage() {
    this.loginElements
      .usernameListItem()
      .invoke("text")
      .then((text) => {
        this.#username = text
          .toString()
          .replace(/Username:/g, "")
          .trim();
      });
    return this.#username;
  }

  #setValidPasswordFromPage() {
    this.loginElements
      .passwordListItem()
      .invoke("text")
      .then((text) => {
        this.#password = text
          .toString()
          .replace(/Password:/g, "")
          .trim();
      });
    return this.#password;
  }

  getUsername(): string {
    return this.#username === ""
      ? this.#setValidUsernameFromPage()
      : this.#username;
  }

  getPassword() {
    return this.#password === ""
      ? this.#setValidPasswordFromPage()
      : this.#password;
  }

  visit() {
    cy.visit("/login");
    this.#setValidUsernameFromPage();
    this.#setValidPasswordFromPage();
  }

  submit() {
    this.loginElements.submitButton().click();
  }

  verifyPageUrl() {
    cy.url().should(
      "eq",
      `${Cypress.config().baseUrl}${Cypress.env("login_url")}`
    );
  }

  verifyPageLoaded() {
    this.verifyPageUrl();
    this.elements
      .baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot("Login Page", { scope: selector });
      });
  }

  verifyEmptyUsername() {
    this.elements.username().invoke("val").should("have.lengthOf", 0);
  }

  verifyEmptyPassword() {
    this.elements.password().invoke("val").should("have.lengthOf", 0);
  }
}

export const loginPage = new LoginPage("", "");
