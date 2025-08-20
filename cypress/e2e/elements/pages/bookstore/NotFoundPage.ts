import { should } from "chai";
import { BasePage } from "../BasePage";

class NotFoundPage extends BasePage {
  
  protected notFoundElements = {
    notFound: () => cy.get(`h1`),
    backToHomePageButton: () => cy.get(`#core`).find(`a[href*="/"]`)
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