import { BasePage } from "./BasePage";

class DialogsPage extends BasePage {
  
  clickJsAlertButton() {
    cy.get(`#js-alert`).click();
  }

  clickJsConfirmButton() {
    cy.get(`#js-confirm`).click();
  }

  clickJsPromptButton() {
    cy.get(`#js-prompt`).click();
  }
  
  setupJsAlertHanding() {
    cy.window().then((win) => { cy.stub(win, 'alert').as('windowAlert') });
  }

  setupJsConfirmationHanding(confirmation: boolean) {
    cy.window().then((win) => { cy.stub(win, 'confirm').as('windowConfirm').returns(confirmation) });
  }

  setupJsPromptHanding(message: string | null) {
    cy.window().then((win) => { cy.stub(win, 'prompt').as('windowPrompt').returns(message) })
  }

  verifyJsAlert() {
    cy.get(`@windowAlert`).should('have.been.calledWith', 'I am a Js Alert');
  }

  verifyJsConfirmation() {
    cy.get(`@windowConfirm`).should('have.been.calledWith', 'I am a Js Confirm');
  }

  verifyJsPrompt() {
    cy.get(`@windowPrompt`).should('have.been.calledWith', 'I am a Js prompt');
  }

  verifyDialogResponse(response: string) {
    response ? cy.get(`#dialog-response`)
                  .should('have.css', 'color', 'rgb(0, 128, 0)')
                  .contains(response)
              : cy.get(`#dialog-response`)
                  .should('have.css', 'color', 'rgb(0, 128, 0)')
                  .and('be.empty');
  }

  visit() {
    cy.visit('/js-dialogs');
  }

  verifyPageLoaded(): void {
    cy.shouldExistAndBeVisible(`#js-alert`)
      .and('have.css', 'background-color', 'rgb(13, 110, 253)')
      .contains('Js Alert');
    cy.shouldExistAndBeVisible(`#js-confirm`)
      .and('have.css', 'background-color', 'rgb(13, 110, 253)')
      .contains('Js Confirm');
    cy.shouldExistAndBeVisible(`#js-prompt`)
      .and('have.css', 'background-color', 'rgb(13, 110, 253)')
      .contains('Js Prompt');
    this.verifyDialogResponse('Waiting');
  }

}

export const dialogsPage = new DialogsPage();