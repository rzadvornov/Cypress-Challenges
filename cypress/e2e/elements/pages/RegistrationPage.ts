import { BasePage } from "./BasePage";

class RegistrationPage extends BasePage {
  
  protected registrationElements = {
    confirmPasswordField: () => cy.get('#confirmPassword'),
    submitButton: () => cy.get('#register > button')
  };

  clearUsername() {
    this.elements.username().clear();
  }

  fillPasswordConfirmation(value: string) {
    this.registrationElements.confirmPasswordField()
      .clear()
      .type(value);
    return this;
  }

  submit() {
    this.registrationElements.submitButton().click();
  }

  visit() {
    cy.visit(`${Cypress.env('registration_url')}`);
  }

  verifyPageLoaded() {
    cy.url().should('eq', `${Cypress.config().baseUrl}${Cypress.env('registration_url')}`);
    this.elements.baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot('Registration Page', { scope: selector });
      });
  }
}

export const registrationPage = new RegistrationPage();