import { BasePage } from "./BasePage";

class FormConfirmationPage extends BasePage {
  private readonly confirmationSelectors = {
    alertMessage: ".alert",
  } as const;

  protected confirmationElements = {
    alertMessage: () => cy.get(`${this.confirmationSelectors.alertMessage}`),
  };

  verifyPageUrl() {
    cy.url().should(
      "eq",
      `${Cypress.config().baseUrl}${Cypress.env("form_confirmation_url")}`
    );
  }

  verifyPageLoaded() {
    this.verifyPageUrl();
    this.elements
      .baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot("Form Confirmation Page", { scope: selector });
      });
  }

  verifyAlertMessage() {
    this.confirmationElements
      .alertMessage()
      .should("be.visible")
      .contains("Thank you for validating your ticket");
  }
}

export const formConfirmationPage = new FormConfirmationPage();
