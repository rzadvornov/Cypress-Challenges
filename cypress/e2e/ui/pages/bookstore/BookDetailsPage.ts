import { BasePage } from "../BasePage";

class BookDetailsPage extends BasePage {
  protected bookCounter: number = 0;

  private readonly bookSelectors = {
    bookTitle: "h3",
    addToCartLink: 'a[href*="bookstore/add-to-cart/"]',
    cartBadge: ".badge",
  } as const;

  protected bookDetailsElements = {
    bookTitle: () => cy.get(`${this.bookSelectors.bookTitle}`),
    addToCart: () => cy.get(`${this.bookSelectors.addToCartLink}`),
    cartItems: () => cy.get(`${this.bookSelectors.cartBadge}`),
  };

  clickAddToCartButton() {
    this.bookDetailsElements.addToCart().click();
    this.bookCounter++;
  }

  verifyPageUrl() {
    cy.url().should(
      "include",
      `${Cypress.config().baseUrl}${Cypress.env("bookstore_url")}/`
    );
  }

  verifyPageLoaded(): void {
    this.verifyPageUrl();
  }

  verifyBookTitle(title: string) {
    this.bookDetailsElements.bookTitle().contains(title);
  }

  verifyBookDescription() {
    this.bookDetailsElements
      .bookTitle()
      .parent()
      .find(`p`)
      .then(($el) => {
        const element = $el[1];
        expect(element.textContent).to.not.be.empty;
      });
  }

  verifyBookPrice() {
    const currencies = ["€", "$", "£"];
    this.bookDetailsElements
      .bookTitle()
      .parent()
      .find(`p`)
      .then(($el) => {
        const element = $el[0];
        const text = element.textContent
          ?.replace("Price:", "")
          .replace(/[0-9\s]/g, "");
        expect(text).to.be.oneOf(currencies);
      });
  }

  verifyAddToCartButton() {
    this.bookDetailsElements
      .addToCart()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot("Book Details Page Add To Cart button", {
          scope: selector,
        });
      });
    this.bookDetailsElements
      .addToCart()
      .should("be.visible")
      .contains("Add To Cart");
  }

  verifyBookCounter() {
    this.bookDetailsElements.cartItems().contains(this.bookCounter);
  }
}

export const bookDetailsPage = new BookDetailsPage();
