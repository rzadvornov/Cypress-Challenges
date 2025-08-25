import { BasePage } from "../BasePage";

class ShoppingCartPage extends BasePage {
  
  private totalOrderAmount: string = "";

  private readonly shoppingCartSelectors = {
    shoppingCartHeader: 'h1',
    emptyCartHeader: 'h2',
    quantityInput: '#cartQty',
    deleteLink: 'a[href*="/bookstore/remove/"]',
    checkoutButton: '[data-testid="checkout"]',
    table: 'table',
    tableBody: 'tbody',
    tableRows: 'tr',
    itemTitle: 'td.information',
    boldSpan: 'span.fw-bold',
    updateButton: 'button',
    span: 'span.text-danger'
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
      .find(`${this.shoppingCartSelectors.boldSpan}`),
    itemTitle: () => cy.get(`${this.shoppingCartSelectors.tableBody}`)
      .find(`${this.shoppingCartSelectors.itemTitle}`),
    table: () => cy.get(`${this.shoppingCartSelectors.table}`),
    tableRows: () => cy.get(`${this.shoppingCartSelectors.tableBody}`)
      .find(`${this.shoppingCartSelectors.tableRows}`),
    itemPrice: () => cy.get(`${this.shoppingCartSelectors.boldSpan}`)
  };

  getTotalOrderAmount() {
    return this.totalOrderAmount;
  }

  checkout() {
    this.shoppingCartElements.checkoutButton().click();
  }

  deleteBookFromCart(title: string) {
    cy.contains(this.shoppingCartSelectors.itemTitle, title)
    .closest(this.shoppingCartSelectors.tableRows)
    .find(this.shoppingCartSelectors.deleteLink)
    .click({force: true});
  }

  setQuantity(quantity: string) {
    this.shoppingCartElements.quantity().clear().type(quantity);
    this.shoppingCartElements.updateButton().click();
  }

  verifyCartIsCleaned() {
    this.elements.baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot('Shopping Cart Page - Empty Cart', { scope: selector });
      });
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

  verifyTitle(title: string) {
    this.shoppingCartElements.itemTitle().should(($titles) => {
      const matchingTitles = $titles.filter((_index, el) =>
        Cypress.$(el).text().includes(title)
      )
      expect(matchingTitles).to.have.length(1)
    })
  }

  verifyTotalChange() {
    this.calculateTotalAmount().then((total) => {
      this.totalOrderAmount = total;
      this.verifyTotalAmount(total);
    })
  }

  private calculateTotalAmount(): Cypress.Chainable<string> {
    const currencies = ['€', '$', '£'] as const;
  
    return this.shoppingCartElements.table()
      .should('exist')
      .then(() => this.shoppingCartElements.tableRows())
      .should('exist')
      .should('have.length.greaterThan', 0)
      .then(($rows) => {
        const calculations: Array<{ quantity: number; price: number; currency: string }> = [];
      
        // Process each row synchronously
        $rows.each((_, row) => {
          const $row = Cypress.$(row);
          const quantityElement = $row.find(this.shoppingCartSelectors.quantityInput);
          const priceElement = $row.find(this.shoppingCartSelectors.boldSpan);
        
          if (quantityElement.length && priceElement.length) {
            const quantity = this.parseQuantity(quantityElement.val());
            const { price, currency } = this.parsePrice(priceElement.text().trim(), currencies);
          
            calculations.push({ quantity, price, currency });
          }
        });
      
        return this.computeFinalTotal(calculations);
      });
  }

  private parseQuantity(value: any): number {
    return parseInt(String(value || '0'), 10) || 0;
  }

  private parsePrice(priceText: string, currencies: readonly string[]): { price: number; currency: string } {
    for (const currency of currencies) {
      if (priceText.includes(currency)) {
        const cleanPrice = priceText.replace(currency, '').trim();
        return {
          price: parseFloat(cleanPrice) || 0,
          currency
        };
      }
    }
  
    return { price: parseFloat(priceText) || 0, currency: '' };
  }

  private computeFinalTotal(calculations: Array<{ quantity: number; price: number; currency: string }>): string {
    if (calculations.length === 0) {
      return '0';
    }
  
    const total = calculations.reduce((sum, { quantity, price }) => sum + (quantity * price), 0);
    const detectedCurrency = calculations.find(calc => calc.currency)?.currency || '';
    const finalTotal = this.roundWithZeros(total, 2);
    return `${finalTotal}${detectedCurrency}`;
  }

  private roundWithZeros(num: number, decimalPlaces: number = 2): string {
    if (typeof num !== 'number' || isNaN(num)) {
        throw new TypeError('First argument must be a valid number');
    }
    
    if (!Number.isInteger(decimalPlaces) || decimalPlaces < 0) {
        throw new TypeError('Decimal places must be a non-negative integer');
    }
    
    return num.toFixed(decimalPlaces);
  }
}

export const shoppingCartPage = new ShoppingCartPage();

