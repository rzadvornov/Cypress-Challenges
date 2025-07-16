import { BasePage } from "./BasePage";

class RegistrationPage extends BasePage {

  clearUsername() {
    const field = cy.get(`#username`);
    field.clear();
  }

  fillPasswordConfirmation(value: string) {
    const field = cy.get(`#confirmPassword`);
    field.clear();
    field.type(value);
    
    return this;
  }

  submit() {
    cy.get(`#register > button`).click();
  }

  visit() {
    cy.visit('/register');
  }

  verifyPageLoaded() {
    cy.url().should('eq', `${Cypress.config().baseUrl}/register`);
    cy.shouldExistAndBeVisible('#username');
    cy.shouldExistAndBeVisible('#password');
    cy.shouldExistAndBeVisible('#confirmPassword');
    cy.shouldExistAndBeVisible('#register > button');
  }

};

export const registrationPage = new RegistrationPage();