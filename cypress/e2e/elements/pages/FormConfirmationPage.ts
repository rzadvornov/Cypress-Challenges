import { BasePage } from "./BasePage";

class FormConfirmationPage extends BasePage {
  
  protected confirmationElements = {
    alertMessage: () => cy.get('.alert')
  };

  verifyPageLoaded() {
    cy.url().should('eq', `${Cypress.config().baseUrl}/form-confirmation`);
  }

  verifyAlertMessage() {
    this.confirmationElements.alertMessage()
      .should('have.css', 'background-color', 'rgb(207, 244, 252)')
      .contains('Thank you for validating your ticket');
  }
}

export const formConfirmationPage = new FormConfirmationPage();