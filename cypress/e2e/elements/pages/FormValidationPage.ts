import { BasePage } from "./BasePage";

class FormValidationPage extends BasePage {
  
  clearContactName() {
    cy.get(`#validationCustom01`).clear();
  }

  fillContactNumber(value: string) {
    const field = cy.get(`#validationCustom05[name="contactnumber"]`);
    field.clear();
    field.type(value);
    
    return this;
  }

  fillDate(value: string) {
    const field = cy.get(`#validationCustom05[name="pickupdate"]`);
    field.clear();
    field.type(value);
    
    return this;
  }

  fillContactName(value: string) {
    const field = cy.get(`#validationCustom01`);
    field.clear();
    field.type(value);
    
    return this;
  }

  fillPaymentMethod(value: string) {
    cy.get(`#validationCustom04`).select(value);
    
    return this;
  }

  submit() {
    cy.get(`form[action="/form-confirmation"] >> button[type="submit"]`).click();
  }

  visit() {
    cy.visit('/form-validation');
  }

  verifyPageLoaded() {
    cy.url().should('eq', `${Cypress.config().baseUrl}/form-validation`);
    cy.shouldExistAndBeVisible(`#validationCustom01`);
    cy.shouldExistAndBeVisible(`#validationCustom05[name="contactnumber"]`);
    cy.shouldExistAndBeVisible(`#validationCustom05[name="pickupdate"]`);
    cy.shouldExistAndBeVisible(`#validationCustom04`);
    cy.shouldExistAndBeVisible(`form[action="/form-confirmation"] >> button[type="submit"]`);
  }

  verifyAllValidationErrors() {
    cy.url().should('eq', `${Cypress.config().baseUrl}/form-validation`);
    this.verifyContactNameValidationError();
    this.verifyContactNumberValidationError();
    this.verifyDateValidationError();
    this.verifyPaymentMethodValidationError();
  }

  verifyContactNameValidationError() {
    cy.shouldExistAndBeVisible(`form[action="/form-confirmation"] > div:has(> #validationCustom01) > div.invalid-feedback`)
      .and('contain', 'Please enter your Contact name.');
  }

  verifyContactNameValidationMessage() {
    cy.shouldExistAndBeVisible(`form[action="/form-confirmation"] > div:has(> #validationCustom01) > div.valid-feedback`)
      .and('contain', 'Looks good!');
  }

  verifyContactNumberValidationError() {
    cy.shouldExistAndBeVisible(`form[action="/form-confirmation"] > div:has(> #validationCustom05[name="contactnumber"]) > div.invalid-feedback`)
      .and('contain', 'Please provide your Contact number.');
  }

  verifyDateValidationError() {
    cy.shouldExistAndBeVisible(`form[action="/form-confirmation"] > div:has(> #validationCustom05[name="pickupdate"]) > div.invalid-feedback`)
      .and('contain', 'Please provide valid Date.');
  }

  verifyPaymentMethodValidationError() {
    cy.shouldExistAndBeVisible(`form[action="/form-confirmation"] > div:has(> #validationCustom04) > div.invalid-feedback`)
      .and('contain', 'Please select the Payment Method.');
  }
  
};

export const formValidationPage = new FormValidationPage();