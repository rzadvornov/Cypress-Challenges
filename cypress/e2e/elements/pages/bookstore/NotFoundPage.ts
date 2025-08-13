import { BasePage } from "../BasePage";

class NotFoundPage extends BasePage {
  
  protected notFoundElements = {
    notFound: () => cy.get('h1'),
    backToHomePageButton: () => cy.get(`#core`).find(`a[href*="/"]`)
  };

  clickBackToHomePageButton() {
    this.notFoundElements.backToHomePageButton()
      .invoke('attr', 'href')
      .then((href) => {
        cy.visit(href || '/bookstore');
      });
  }

  visitNotExistedPage(url: string) {
    cy.visit(url, { 
    failOnStatusCode: false 
  });
  }
  
  verifyPageLoaded(): void {
    this.notFoundElements.notFound().contains('404');
    this.notFoundElements.backToHomePageButton().contains('Back to homepage');
  }

  verifyHomePage() {
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  }
}

export const notFoundPage = new NotFoundPage();