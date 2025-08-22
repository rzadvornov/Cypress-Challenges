import { BasePage } from "../BasePage";

class CheckoutPage extends BasePage {
  
  private readonly checkoutSelectors = {
    totalAmountHeader: 'h2',
    nameInput: '#name',
    addressInput: '#address',
    cardHolderNameInput: '#card-name',
    cardNumberInput: '#card-number',
    expirationMonthSelect: '#card-expiry-month',
    expirationYearSelect: '#card-expiry-year',
    cardCVCInput: '#card-cvc',
    purchaseButton: '[data-testid="purchase"]'
  } as const;

  protected checkoutElements = {
    totalAmount: () => cy.get(`${this.checkoutSelectors.totalAmountHeader}`),
    name: () => cy.get(`${this.checkoutSelectors.nameInput}`),
    address: () => cy.get(`${this.checkoutSelectors.addressInput}`),
    cardHolderName: () => cy.get(`${this.checkoutSelectors.cardHolderNameInput}`),
    cardNumber: () => cy.get(`${this.checkoutSelectors.cardNumberInput}`),
    expirationMonth: () => cy.get(`${this.checkoutSelectors.expirationMonthSelect}`),
    expirationYear: () => cy.get(`${this.checkoutSelectors.expirationYearSelect}`),
    cardCVC: () => cy.get(`${this.checkoutSelectors.cardCVCInput}`),
    purchaseButton: () => cy.get(`${this.checkoutSelectors.purchaseButton}`)
  };

  fillName(name: string) {
    this.checkoutElements.name()
      .clear()
      .type(name);
  }

  fillAddress(address: string) {
    this.checkoutElements.address()
      .clear()
      .type(address);
  }

  fillCardHolderName(cardHolderName: string) {
    this.checkoutElements.cardHolderName()
      .clear()
      .type(cardHolderName);
  }

  fillCardNumber(cardNumber: string) {
    this.checkoutElements.cardNumber()
      .clear()
      .type(cardNumber);
  }

  fillCardExpirationMonth(expirationMonth: string) {
    this.checkoutElements.expirationMonth()
      .clear()
      .type(expirationMonth);
  }

  fillExpirationYear(expirationYear: string) {
    this.checkoutElements.expirationYear()
      .clear()
      .type(expirationYear);
  }

  fillCardCVC(cardCVC: string) {
    this.checkoutElements.cardCVC()
      .clear()
      .type(cardCVC);
  }

  purchase() {
    this.checkoutElements.purchaseButton().click();
  }

  verifyPageUrl() {
    cy.url().should('include', `${Cypress.config().baseUrl}${Cypress.env('bookstore_url')}${Cypress.env('checkout_url')}`);
  }

  verifyPageLoaded(): void {
    this.verifyPageUrl();
    this.elements.baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot('Checkout Page', { scope: selector });
      });
  }
  
  verifyTotalAmount(totalAmount: string) {
    this.checkoutElements.totalAmount()
      .should('be.visible')
      .invoke('text')
      .should('eq', totalAmount);
  }
}

export const checkoutPage = new CheckoutPage();