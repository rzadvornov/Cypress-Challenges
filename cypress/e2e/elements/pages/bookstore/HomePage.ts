import { BasePage } from "../BasePage";

class HomePage extends BasePage {
  
  private readonly homeSelectors = {
    logoLink: 'a[href*="bookstore"]',
    booksContainer: '#books',
    bookCards: '#books .card-product-user',
    searchInput: '#search-input',
    searchButton: '[data-testid="search-btn"], .search-button, button[type="submit"]',
    categoryFilter: '.filter_sort',
    cartLink: 'a[href*="cart"]',
    cartCounter: '[data-testid="cart-count"], .cart-count, .badge',
    signInButton: '[data-testid="goto-signin"]',
    paginationContainer: '#pagination'
  } as const;

  protected homeElements = {
    logo: () => cy.get(`${this.homeSelectors.logoLink}`),
    bookContainer: () => cy.get(`${this.homeSelectors.booksContainer}`),
    bookItems: () => cy.get(`${this.homeSelectors.bookCards}`),
    searchField: () => cy.get(`${this.homeSelectors.searchInput}`),
    searchButton: () => cy.get(`${this.homeSelectors.searchButton}`),
    categoryFilter: () => cy.get(`${this.homeSelectors.categoryFilter}`),
    cartIcon: () => cy.get(`${this.homeSelectors.cartLink}`),
    cartCounter: () => cy.get(`${this.homeSelectors.cartCounter}`),
    signInButton: () => cy.get(`${this.homeSelectors.signInButton}`),
    paginationContainer: () => cy.get(`${this.homeSelectors.paginationContainer}`)
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
              foundHref = href || `${Cypress.env('bookstore_url')}`;
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
        cy.visit(href || `${Cypress.env('bookstore_url')}`);
      });
  }

  setResolution(resolution: string) {
    const [width, height] = resolution.split('x').map(Number);
    cy.viewport(width, height);
  }

  signIn() {
    this.homeElements.signInButton().click();
  }

  visit() {
    cy.visit(`${Cypress.env('bookstore_url')}`);
  }

  verifyPageUrl() {
    cy.url().should('eq', `${Cypress.config().baseUrl}${Cypress.env('bookstore_url')}`);
  }

  verifyPageLoaded(): void {
    this.verifyPageUrl();
    this.elements.baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot('Book Store Home Page', { scope: selector });
      });
    this.homeElements.searchButton()
      .should('be.visible')
      .contains('Search');
    this.verifyNavigationElements();
    this.verifyBookstoreLogo();
    this.homeElements.logo()
      .should('be.visible')
      .contains('All Books');
  }

  verifyNavigationElements() {
    this.homeElements.signInButton()
      .should('be.visible')
      .contains("Sign In");
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
                .and('be.visible')
                .invoke('text')
                .should('have.length.gt', 0);
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
      .should('be.visible')
      .contains('All Books');
  }
}

export const homePage = new HomePage();