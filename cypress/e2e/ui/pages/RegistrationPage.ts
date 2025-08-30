import { BasePage } from "./BasePage";

class RegistrationPage extends BasePage {
  private readonly registrationSelectors = {
    confirmPasswordField: "#confirmPassword",
    registerForm: "#register",
    submitButton: "button",
  } as const;

  protected registrationElements = {
    confirmPasswordField: () =>
      cy.get(`${this.registrationSelectors.confirmPasswordField}`),
    submitButton: () =>
      cy
        .get(`${this.registrationSelectors.registerForm}`)
        .find(`${this.registrationSelectors.submitButton}`),
  };

  clearUsername() {
    this.elements.username().clear();
  }

  fillPasswordConfirmation(value: string) {
    this.registrationElements.confirmPasswordField().clear().type(value);
    return this;
  }

  submit() {
    this.registrationElements.submitButton().click();
  }

  visit() {
    cy.visit(`${Cypress.env("registration_url")}`);
  }

  verifyPageUrl() {
    cy.url().should(
      "eq",
      `${Cypress.config().baseUrl}${Cypress.env("registration_url")}`
    );
  }

  verifyPageLoaded() {
    this.verifyPageUrl();
    this.elements
      .baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot("Registration Page", { scope: selector });
      });
  }
}

export const registrationPage = new RegistrationPage();
