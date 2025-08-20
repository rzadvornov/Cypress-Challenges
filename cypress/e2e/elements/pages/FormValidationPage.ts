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
    this.validationElements.contactNumberField()
      .clear()
      .type(value);
    return this;
  }

  fillDate(value: string) {
    this.validationElements.pickupDateField()
      .clear()
      .type(value);
    
    return this;
  }

  fillContactName(value: string) {
    this.validationElements.contactNameField()
      .clear()
      .type(value);
    return this;
  }

  fillPaymentMethod(value: string) {
    this.validationElements.paymentMethodField()
      .select(value);
    return this;
  }

  submit() {
    this.validationElements.submitButton().click();
  }

  visit() {
    cy.visit(`${Cypress.env('form_validation_url')}`);
  }

  verifyPageLoaded() {
    cy.url().should('eq', `${Cypress.config().baseUrl}${Cypress.env('form_validation_url')}`);
    this.elements.baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot('Form Validation Page', { scope: selector });
      });
  }

  verifyAllValidationErrors() {
    cy.url().should('eq', `${Cypress.config().baseUrl}${Cypress.env('form_validation_url')}`);
    this.verifyContactNameValidationError();
    this.verifyContactNumberValidationError();
    this.verifyDateValidationError();
    this.verifyPaymentMethodValidationError();
  }

  verifyContactNameValidationError() {
    this.validationElements.contactNameInvalidFeedback()
      .should('be.visible')
      .contains('Please enter your Contact name.');
  }

  verifyContactNameValidationMessage() {
    this.validationElements.contactNameValidFeedback()
      .should('be.visible')
      .contains('Looks good!');
  }

  verifyContactNumberValidationError() {
    this.validationElements.contactNumberInvalidFeedback()
      .should('be.visible')
      .contains('Please provide your Contact number.');
  }

  verifyDateValidationError() {
    this.validationElements.dateInvalidFeedback()
      .should('be.visible')
      .contains('Please provide valid Date.');
  }

  verifyPaymentMethodValidationError() {
    this.validationElements.paymentMethodInvalidFeedback()
      .should('be.visible')
      .contains('Please select the Payment Method.');
  }
}

export const formValidationPage = new FormValidationPage();