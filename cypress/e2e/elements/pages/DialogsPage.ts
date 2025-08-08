import { BasePage } from "./BasePage";

class DialogsPage extends BasePage {
  
  protected dialogElements = {
    jsAlertButton: () => cy.get('#js-alert'),
    jsConfirmButton: () => cy.get('#js-confirm'),
    jsPromptButton: () => cy.get('#js-prompt'),
    dialogResponse: () => cy.get('#dialog-response')
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
    response ? this.dialogElements.dialogResponse()
                  .should('have.css', 'color', 'rgb(0, 128, 0)')
                  .contains(response)
              : this.dialogElements.dialogResponse()
                  .should('have.css', 'color', 'rgb(0, 128, 0)')
                  .and('be.empty');
  }

  visit() {
    cy.visit('/js-dialogs');
  }

  verifyPageLoaded(): void {
    this.dialogElements.jsAlertButton()
      .should('exist')
      .and('be.visible')
      .and('have.css', 'background-color', 'rgb(13, 110, 253)')
      .contains('Js Alert');
    
    this.dialogElements.jsConfirmButton()
      .should('exist')
      .and('be.visible')
      .and('have.css', 'background-color', 'rgb(13, 110, 253)')
      .contains('Js Confirm');
    
    this.dialogElements.jsPromptButton()
      .should('exist')
      .and('be.visible')
      .and('have.css', 'background-color', 'rgb(13, 110, 253)')
      .contains('Js Prompt');
    
    this.verifyDialogResponse('Waiting');
  }
}

export const dialogsPage = new DialogsPage();