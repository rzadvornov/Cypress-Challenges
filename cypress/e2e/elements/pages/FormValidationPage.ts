import { BasePage } from "./BasePage";

class FormValidationPage extends BasePage {
  
  protected validationElements = {
    contactNameField: () => cy.get('#validationCustom01'),
    contactNumberField: () => cy.get('#validationCustom05[name="contactnumber"]'),
    pickupDateField: () => cy.get('#validationCustom05[name="pickupdate"]'),
    paymentMethodField: () => cy.get('#validationCustom04'),
    submitButton: () => cy.get('form[action="/form-confirmation"] >> button[type="submit"]'),
    // Validation feedback elements
    contactNameInvalidFeedback: () => cy.get('form[action="/form-confirmation"] > div:has(> #validationCustom01) > div.invalid-feedback'),
    contactNameValidFeedback: () => cy.get('form[action="/form-confirmation"] > div:has(> #validationCustom01) > div.valid-feedback'),
    contactNumberInvalidFeedback: () => cy.get('form[action="/form-confirmation"] > div:has(> #validationCustom05[name="contactnumber"]) > div.invalid-feedback'),
    dateInvalidFeedback: () => cy.get('form[action="/form-confirmation"] > div:has(> #validationCustom05[name="pickupdate"]) > div.invalid-feedback'),
    paymentMethodInvalidFeedback: () => cy.get('form[action="/form-confirmation"] > div:has(> #validationCustom04) > div.invalid-feedback')
  };

  clearContactName() {
    this.validationElements.contactNameField().clear();
  }

  fillContactNumber(value: string) {
    const field = this.validationElements.contactNumberField();
    field.clear();
    field.type(value);
    
    return this;
  }

  fillDate(value: string) {
    const field = this.validationElements.pickupDateField();
    field.clear();
    field.type(value);
    
    return this;
  }

  fillContactName(value: string) {
    const field = this.validationElements.contactNameField();
    field.clear();
    field.type(value);
    
    return this;
  }

  fillPaymentMethod(value: string) {
    this.validationElements.paymentMethodField().select(value);
    
    return this;
  }

  submit() {
    this.validationElements.submitButton().click();
  }

  visit() {
    cy.visit('/form-validation');
  }

  verifyPageLoaded() {
    cy.url().should('eq', `${Cypress.config().baseUrl}/form-validation`);
    
    this.validationElements.contactNameField()
      .should('exist')
      .and('be.visible');
    
    this.validationElements.contactNumberField()
      .should('exist')
      .and('be.visible');
    
    this.validationElements.pickupDateField()
      .should('exist')
      .and('be.visible');
    
    this.validationElements.paymentMethodField()
      .should('exist')
      .and('be.visible');
    
    this.validationElements.submitButton()
      .should('exist')
      .and('be.visible');
  }

  verifyAllValidationErrors() {
    cy.url().should('eq', `${Cypress.config().baseUrl}/form-validation`);
    this.verifyContactNameValidationError();
    this.verifyContactNumberValidationError();
    this.verifyDateValidationError();
    this.verifyPaymentMethodValidationError();
  }

  verifyContactNameValidationError() {
    this.validationElements.contactNameInvalidFeedback()
      .should('exist')
      .and('be.visible')
      .and('contain', 'Please enter your Contact name.');
  }

  verifyContactNameValidationMessage() {
    this.validationElements.contactNameValidFeedback()
      .should('exist')
      .and('be.visible')
      .and('contain', 'Looks good!');
  }

  verifyContactNumberValidationError() {
    this.validationElements.contactNumberInvalidFeedback()
      .should('exist')
      .and('be.visible')
      .and('contain', 'Please provide your Contact number.');
  }

  verifyDateValidationError() {
    this.validationElements.dateInvalidFeedback()
      .should('exist')
      .and('be.visible')
      .and('contain', 'Please provide valid Date.');
  }

  verifyPaymentMethodValidationError() {
    this.validationElements.paymentMethodInvalidFeedback()
      .should('exist')
      .and('be.visible')
      .and('contain', 'Please select the Payment Method.');
  }
}

export const formValidationPage = new FormValidationPage();