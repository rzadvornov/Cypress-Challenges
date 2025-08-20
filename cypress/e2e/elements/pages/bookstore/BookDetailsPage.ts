import { BasePage } from "../BasePage";

class BookDetailsPage extends BasePage {

  protected bookCounter: number = 0;
  
  protected bookDetailsElements = {
    bookTitle: () => cy.get(`h3`),
    addToCart: () => cy.get(`a[href*="bookstore/add-to-cart/"]`),
    cartItems: () => cy.get(`.badge`)
  };

  clickAddToCartButton() {
    this.bookDetailsElements.addToCart().click();
    this.bookCounter++;
  }

  verifyPageLoaded(): void {
    cy.url().should('include', `${Cypress.config().baseUrl}${Cypress.env('bookstore_url')}/`);
  }

  verifyBookTitle(title: string) {
    this.bookDetailsElements.bookTitle().contains(title);
  }

  verifyBookDescription() {
    this.bookDetailsElements.bookTitle()
      .parent()
      .find(`p`)
      .then(($el) => {
        const element = $el[1];
        expect(element.textContent).to.not.be.empty;
       })
  }

  verifyBookPrice() {
    const currencies = ['€', '$', '£'];
    this.bookDetailsElements.bookTitle()
      .parent()
      .find(`p`)
      .then(($el) => {
        const element = $el[0];
        const text = element.textContent?.replace('Price:', '').replace(/[0-9\s]/g, '');
        expect(text).to.be.oneOf(currencies);
       })
  }

  verifyAddToCartButton() {
    this.bookDetailsElements.addToCart()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot('Book Details Page Add To Cart button', { scope: selector });
      });
    this.bookDetailsElements.addToCart()
      .should('be.visible') 
      .contains('Add To Cart');
    
  }

  verifyBookCounter() {
    this.bookDetailsElements.cartItems().contains(this.bookCounter);
  }
}

export const bookDetailsPage = new BookDetailsPage();