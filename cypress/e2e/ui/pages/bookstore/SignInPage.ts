import { BasePage } from "../BasePage";

class SignInPage extends BasePage {
  private readonly signInSelectors = {
    signInHeader: "h1",
    emailInput: "#email",
    signInButton: "#submit",
    signUpButton: "#go-signup",
  } as const;

  protected signInElements = {
    signIn: () => cy.get(`${this.signInSelectors.signInHeader}`),
    email: () => cy.get(`${this.signInSelectors.emailInput}`),
    signInButton: () => cy.get(`${this.signInSelectors.signInButton}`),
    signUpButton: () => cy.get(`${this.signInSelectors.signUpButton}`),
  };

  fillEmail(email: string) {
    this.signInElements.email().clear().type(email);
    return this;
  }

  submit() {
    this.signInElements.signInButton().click();
  }

  register() {
    this.signInElements.signUpButton().click();
  }

  verifyPageUrl() {
    cy.url().should(
      "eq",
      `${Cypress.config().baseUrl}${Cypress.env("bookstore_url")}${Cypress.env(
        "signIn_url"
      )}`
    );
  }

  verifyPageLoaded(): void {
    this.verifyPageUrl();
    this.elements
      .baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot("SignIn Page", { scope: selector });
      });
    this.signInElements.signIn().should("be.visible").contains("Sign in");
    this.signInElements.signInButton().should("be.visible").contains("Sign In");
    this.signInElements
      .signUpButton()
      .should("be.visible")
      .contains("Sign Up!");
  }

  verifyLoginError() {
    this.elements
      .baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot("SignIn Page Login Error", { scope: selector });
      });
    this.getAlert()
      .should("be.visible")
      .contains("No user found with the given email address");
  }
}

export const signInPage = new SignInPage();
