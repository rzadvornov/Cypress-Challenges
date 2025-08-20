import { BasePage } from "./BasePage";

class FormConfirmationPage extends BasePage {
  
  protected confirmationElements = {
    alertMessage: () => cy.get('.alert')
  };

  verifyPageLoaded() {
    cy.url().should('eq', `${Cypress.config().baseUrl}${Cypress.env('form_confirmation_url')}`);
    this.elements.baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot('Form Confirmation Page', { scope: selector });
      });
  }

  verifyAlertMessage() {
    this.confirmationElements.alertMessage()
      .should('be.visible')
      .contains('Thank you for validating your ticket');
  }
}

export const formConfirmationPage = new FormConfirmationPage();