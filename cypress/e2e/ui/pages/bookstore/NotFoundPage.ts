import { BasePage } from "../BasePage";

class NotFoundPage extends BasePage {
  
  private readonly notFoundSelectors = {
    notFoundHeader: 'h1',
    coreContainer: '#core',
    backToHomeLink: 'a[href*="/"]'
  } as const;

  protected notFoundElements = {
    notFound: () => cy.get(`${this.notFoundSelectors.notFoundHeader}`),
    backToHomePageButton: () => cy.get(`${this.notFoundSelectors.coreContainer}`)
    .find(`${this.notFoundSelectors.backToHomeLink}`)
  };

  clickBackToHomePageButton() {
    this.notFoundElements.backToHomePageButton()
      .invoke('attr', 'href')
      .then((href) => {
        cy.visit(href || `${Cypress.env('bookstore_url')}`);
      });
  }

  visitNotExistedPage(url: string) {
    cy.visit(url, { 
    failOnStatusCode: false 
  });
  }
  
  verifyPageLoaded(): void {
    this.elements.baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot('404 Page', { scope: selector });
      });
    this.notFoundElements.notFound()
      .should('be.visible')
      .contains('404');
    this.notFoundElements.backToHomePageButton()
      .should('be.visible')
      .contains('Back to homepage');
  }

  verifyHomePage() {
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  }
}

export const notFoundPage = new NotFoundPage();