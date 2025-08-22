import { BasePage } from "./BasePage";

class FormValidationPage extends BasePage {
  
  private readonly validationSelectors = {
    contactNameField: '#validationCustom01',
    contactNumberField: '#validationCustom05[name="contactnumber"]',
    pickupDateField: '#validationCustom05[name="pickupdate"]',
    paymentMethodField: '#validationCustom04',
    formAction: 'form[action="/form-confirmation"]',
    submitButton: 'button[type="submit"]',
    invalidFeedback: 'div.invalid-feedback',
    validFeedback: 'div.valid-feedback',
    contactNameContainer: 'form[action="/form-confirmation"] > div:has(> #validationCustom01)',
    contactNumberContainer: 'form[action="/form-confirmation"] > div:has(> #validationCustom05[name="contactnumber"])',
    dateContainer: 'form[action="/form-confirmation"] > div:has(> #validationCustom05[name="pickupdate"])',
    paymentMethodContainer: 'form[action="/form-confirmation"] > div:has(> #validationCustom04)'
  } as const;

  protected validationElements = {
    contactNameField: () => cy.get(`${this.validationSelectors.contactNameField}`),
    contactNumberField: () => cy.get(`${this.validationSelectors.contactNumberField}`),
    pickupDateField: () => cy.get(`${this.validationSelectors.pickupDateField}`),
    paymentMethodField: () => cy.get(`${this.validationSelectors.paymentMethodField}`),
    submitButton: () => cy.get(`${this.validationSelectors.formAction}`)
      .find(`${this.validationSelectors.submitButton}`),
    // Validation feedback elements
    contactNameInvalidFeedback: () => cy.get(`${this.validationSelectors.contactNameContainer}`)
      .find(`${this.validationSelectors.invalidFeedback}`),
    contactNameValidFeedback: () => cy.get(`${this.validationSelectors.contactNameContainer}`)
      .find(`${this.validationSelectors.validFeedback}`),
    contactNumberInvalidFeedback: () => cy.get(`${this.validationSelectors.contactNumberContainer}`)
      .find(`${this.validationSelectors.invalidFeedback}`),
    dateInvalidFeedback: () => cy.get(`${this.validationSelectors.dateContainer}`)
      .find(`${this.validationSelectors.invalidFeedback}`),
    paymentMethodInvalidFeedback: () => cy.get(`${this.validationSelectors.paymentMethodContainer}`)
      .find(`${this.validationSelectors.invalidFeedback}`)
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

  verifyPageUrl() {
    cy.url().should('eq', `${Cypress.config().baseUrl}${Cypress.env('form_validation_url')}`);
  }

  verifyPageLoaded() {
    this.verifyPageUrl();
    this.elements.baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot('Form Validation Page', { scope: selector });
      });
  }

  verifyAllValidationErrors() {
    this.verifyPageUrl();
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