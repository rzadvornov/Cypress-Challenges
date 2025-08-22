import { BasePage } from "../BasePage";

class ShoppingCartPage extends BasePage {
  
  private readonly shoppingCartSelectors = {
    shoppingCartHeader: 'h1',
    emptyCartHeader: 'h2',
    quantityInput: '#cartQty',
    deleteLink: 'a[href*="/bookstore/remove/"]',
    checkoutButton: '[data-testid="checkout"]',
    tableBody: 'tbody',
    boldSpan: 'span.fw-bold',
    updateButton: 'button',
    span: 'span'
  } as const;

  protected shoppingCartElements = {
    shoppingCart: () => cy.get(`${this.shoppingCartSelectors.shoppingCartHeader}`),
    emptyCart: () => cy.get(`${this.shoppingCartSelectors.emptyCartHeader}`),
    quantity: () => cy.get(`${this.shoppingCartSelectors.quantityInput}`),
    updateButton: () => cy.get(`${this.shoppingCartSelectors.quantityInput}`)
      .parent().find(`${this.shoppingCartSelectors.updateButton}`),
    deleteButton: () => cy.get(`${this.shoppingCartSelectors.deleteLink}`),
    checkoutButton: () => cy.get(`${this.shoppingCartSelectors.checkoutButton}`),
    totalAmount: () => cy.get(`${this.shoppingCartSelectors.checkoutButton}`)
      .parent().find(`${this.shoppingCartSelectors.span}`),
    price: () => cy.get(`${this.shoppingCartSelectors.tableBody}`)
      .find(`${this.shoppingCartSelectors.boldSpan}`)
  };

  setQuantity(quantity: string) {
    this.shoppingCartElements.quantity().type(quantity);
    this.shoppingCartElements.updateButton().click();
  }

  checkout() {
    this.shoppingCartElements.checkoutButton().click();
  }

  verifyEmptyCart() {
    this.shoppingCartElements.emptyCart()
      .should('be.visible')
      .contains('No items in carts');
  }

  verifyPageUrl() {
    cy.url().should('eq', `${Cypress.config().baseUrl}${Cypress.env('bookstore_url')}${Cypress.env('cart_url')}`);
  }

  verifyPageLoaded(): void {
    this.verifyPageUrl();
    this.shoppingCartElements.shoppingCart()
      .should('be.visible')
      .contains('Shopping Cart');
    this.verifyPrice();
    this.verifyQuantity();
    this.elements.baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot('Shopping Cart Page', { scope: selector });
      });
  }

  verifyPrice() {
    const currencies = ['€', '$', '£'];
    this.shoppingCartElements.price().each(($price) => {
      cy.wrap($price)
        .should('be.visible')
        .invoke('text')
        .then((priceText) => {
          const text = priceText.replace(/[0-9\s]/g, '');
          expect(text).to.be.oneOf(currencies);
      });
    })
  }

  verifyQuantity() {
    this.shoppingCartElements.quantity().each(($quantity) => {
      cy.wrap($quantity)
        .should('be.visible')
        .invoke('val')
        .should('match', /^[0-9]+$/);
    })
  }

  verifyTotalAmount(totalAmount: string) {
    this.shoppingCartElements.totalAmount()
      .should('be.visible')
      .invoke('text')
      .should('eq', totalAmount);
  }
}

export const shoppingCartPage = new ShoppingCartPage();

