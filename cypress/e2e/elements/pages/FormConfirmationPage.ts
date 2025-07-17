import { BasePage } from "./BasePage";

class FormConfirmationPage extends BasePage {

  verifyPageLoaded() {
    cy.url().should('eq', `${Cypress.config().baseUrl}/form-confirmation`);
  }

  verifyAlertMessage() {
    const alert = cy.get(`.alert`);
    alert.should('have.css', 'background-color', 'rgb(207, 244, 252)');
    alert.contains('Thank you for validating your ticket');
  }
}

export const formConfirmationPage = new FormConfirmationPage();