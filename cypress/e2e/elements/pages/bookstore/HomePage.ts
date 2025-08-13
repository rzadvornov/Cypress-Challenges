import { BasePage } from "../BasePage";

class HomePage extends BasePage {
  
  protected homeElements = {
    logo: () => cy.get(`a[href*="bookstore"]`),
    bookContainer: () => cy.get(`#books`),
    bookItems: () => cy.get(`#books .card-product-user`),
    searchField: () => cy.get(`#search-input`),
    searchButton: () => cy.get(`[data-testid="search-btn"], .search-button, button[type="submit"]`),
    categoryFilter: () => cy.get(`.filter_sort`),
    cartIcon: () => cy.get(`a[href*="cart"]`),
    cartCounter: () => cy.get(`[data-testid="cart-count"], .cart-count, .badge`),
    signInButton: () => cy.get(`[data-testid="goto-signin"]`),
    paginationContainer: () => cy.get(`#pagination`)
  };

  enterSearchTerm(searchTerm: string) {
    this.homeElements.searchField()
      .clear()
      .type(searchTerm);
  }

  search() {
    this.homeElements.searchButton().click();
  }

  selectBook(bookTitle: string) {
    let foundHref: string | null = null;
    this.homeElements.bookItems().each(($book) => {
      cy.wrap($book).within(() => {
        cy.get('[data-testid^="title-"]').should('exist').then(($titleElement) => {
          const titleElementText = $titleElement.text();
          if (titleElementText.includes(bookTitle)) {
            const dataTestId = $titleElement.attr('data-testid');
            cy.get(`[data-testid="${dataTestId}"]`)
            .parent()
            .invoke('attr', 'href')
            .then((href: string | undefined) => {
              foundHref = href || '/bookstore';
          });
        }
      });
    });
    }).then(() => {
    // Navigate outside the within block if href was found
      if (foundHref) {
        cy.visit(foundHref);
      }
    });
  };

  selectCategory(categoryId: string) {
    cy.get(`[data-testid="category-${categoryId}"]`)
      .invoke('attr', 'href')
      .then((href) => {
        cy.visit(href || '/bookstore');
      });
  }

  visit() {
    cy.visit(`/bookstore`);
  }

  verifyPageLoaded(): void {
    cy.url().should('eq', `${Cypress.config().baseUrl}/bookstore`);
    this.homeElements.searchField()
      .should('be.visible');
    this.homeElements.searchButton()
      .contains('Search')
      .and('have.css', 'background-color', 'rgb(13, 110, 253)');
    this.verifyNavigationElements();
    this.verifyBookstoreLogo();
    this.homeElements.logo()
      .contains('All Books').and('be.visible');
    this.homeElements.bookContainer()
      .should('be.visible');
    this.homeElements.categoryFilter()
      .should('be.visible');
    this.homeElements.cartCounter()
      .should('be.visible');
  }

  verifyNavigationElements() {
    this.homeElements.signInButton()
      .contains("Sign In")
      .and('have.attr', 'style', 'color: white;');
    this.homeElements.cartIcon().should('be.visible');
    this.homeElements.paginationContainer().should('be.visible');
  }

  verifySearchExecuted() {
    cy.url().should('include', 'search');
    this.homeElements.bookItems()
      .should('have.length.greaterThan', 0);
  }

  verifySearchResult(searchTerm: string) {
    this.homeElements.bookItems().each(($book) => {
      cy.wrap($book).within(() => {
        cy.get('[data-testid^="title-"]').should('exist').contains(searchTerm);
      });
    }); 
  }

  verifyEachBookHasAttributes() {
    const currencies = ['€', '$', '£'];
    this.homeElements.bookItems().each(($book) => {
    cy.wrap($book).within(() => {
        // Find any element with data-testid starting with "title-" to get the book ID
        cy.get('[data-testid^="title-"]').should('exist').then(($titleElement) => {
            const dataTestId = $titleElement.attr('data-testid');   
            if (dataTestId) {
              const bookId = dataTestId.replace('title-', '');
                
                // Now verify all elements for this specific book
              cy.get(`[data-testid="title-${bookId}"]`)
                .should('exist')
                .and('be.visible');
              cy.get(`[data-testid="price-${bookId}"]`)
                .should('exist')
                .invoke('text')
                .then((priceText) => {
                  const text = priceText.replace(/[0-9\s]/g, '');
                  expect(text).to.be.oneOf(currencies);
                }); 
            
              cy.get(`[data-testid="cart-${bookId}"]`)
                .should('exist')
                .contains('Add To Cart');
              cy.get(`[data-testid="image-${bookId}"]`)
                .should('exist')
                .and('be.visible');
            } else {
                throw new Error('data-testid attribute not found on title element');
            }
         });
      });
    });
  }

  verifyAvailableBooks() {
    this.homeElements.bookContainer().children()
      .should('have.length.greaterThan', 0);
  }
  
  verifyBookstoreLogo() {
    this.homeElements.logo()
      .contains('All Books').and('be.visible');
  }
}

export const homePage = new HomePage();