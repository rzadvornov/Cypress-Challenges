import { BasePage } from "./BasePage";

class DialogsPage extends BasePage {
  private readonly dialogSelectors = {
    jsAlertButton: "#js-alert",
    jsConfirmButton: "#js-confirm",
    jsPromptButton: "#js-prompt",
    dialogResponse: "#dialog-response",
  } as const;

  protected dialogElements = {
    jsAlertButton: () => cy.get(`${this.dialogSelectors.jsAlertButton}`),
    jsConfirmButton: () => cy.get(`${this.dialogSelectors.jsConfirmButton}`),
    jsPromptButton: () => cy.get(`${this.dialogSelectors.jsPromptButton}`),
    dialogResponse: () => cy.get(`${this.dialogSelectors.dialogResponse}`),
  };

  clickJsAlertButton() {
    this.dialogElements.jsAlertButton().click();
  }

  clickJsConfirmButton() {
    this.dialogElements.jsConfirmButton().click();
  }

  clickJsPromptButton() {
    this.dialogElements.jsPromptButton().click();
  }

  setupJsAlertHanding() {
    cy.window().then((win) => {
      cy.stub(win, "alert").as("windowAlert");
    });
  }

  setupJsConfirmationHanding(confirmation: boolean) {
    cy.window().then((win) => {
      cy.stub(win, "confirm").as("windowConfirm").returns(confirmation);
    });
  }

  setupJsPromptHanding(message: string | null) {
    cy.window().then((win) => {
      cy.stub(win, "prompt").as("windowPrompt").returns(message);
    });
  }

  verifyJsAlert() {
    cy.get(`@windowAlert`).should("have.been.calledWith", "I am a Js Alert");
  }

  verifyJsConfirmation() {
    cy.get(`@windowConfirm`).should(
      "have.been.calledWith",
      "I am a Js Confirm"
    );
  }

  verifyJsPrompt() {
    cy.get(`@windowPrompt`).should("have.been.calledWith", "I am a Js prompt");
  }

  verifyDialogResponse(response: string) {
    response
      ? this.dialogElements
          .dialogResponse()
          .should("be.visible")
          .contains(response)
      : this.dialogElements
          .dialogResponse()
          .should("be.visible")
          .and("be.empty");
  }

  visit() {
    cy.visit(`${Cypress.env("dialogs_url")}`);
  }

  verifyPageUrl() {
    cy.url().should(
      "eq",
      `${Cypress.config().baseUrl}${Cypress.env("dialogs_url")}`
    );
  }

  verifyPageLoaded(): void {
    this.verifyPageUrl();
    this.elements
      .baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot("JS Dialogs Page", { scope: selector });
      });
    this.dialogElements
      .jsAlertButton()
      .should("be.visible")
      .contains("Js Alert");

    this.dialogElements
      .jsConfirmButton()
      .should("be.visible")
      .contains("Js Confirm");

    this.dialogElements
      .jsPromptButton()
      .should("be.visible")
      .contains("Js Prompt");

    this.verifyDialogResponse("Waiting");
  }
}

export const dialogsPage = new DialogsPage();
