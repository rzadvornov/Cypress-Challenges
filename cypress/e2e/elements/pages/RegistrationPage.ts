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
    const field = this.registrationElements.confirmPasswordField();
    field.clear();
    field.type(value);
    
    return this;
  }

  submit() {
    this.registrationElements.submitButton().click();
  }

  visit() {
    cy.visit('/register');
  }

  verifyPageLoaded() {
    cy.url().should('eq', `${Cypress.config().baseUrl}/register`);
    
    this.elements.username()
      .should('exist')
      .and('be.visible');
    
    this.elements.password()
      .should('exist')
      .and('be.visible');
    
    this.registrationElements.confirmPasswordField()
      .should('exist')
      .and('be.visible');
    
    this.registrationElements.submitButton()
      .should('exist')
      .and('be.visible');
  }
}

export const registrationPage = new RegistrationPage();