import { BasePage } from "./BasePage";

const CONFIG = {
  cookieName: 'express:sess',
  cookieSetValue: 'eyJmbGFzaCI6e30sInVzZXJuYW1lIjoicHJhY3RpY2UifQ==',
  cookieUnsetValue: 'eyJmbGFzaCI6e319',
};

class DashboardPage extends BasePage {
  
  protected dashboardElements = {
    greetingMessage: () => cy.get('#username'), 
    coreContainer: () => cy.get('#core'),
    logoutLink: () => cy.get('#core').find('a[href="/logout"]')
  };

  verifyPageLoaded() {
    cy.url().should('eq', `${Cypress.config().baseUrl}/secure`);
  }

  verifyGreetingMessage(userName: string) {
    this.dashboardElements.greetingMessage()
      .contains(`Hi, ${userName}!`)
      .should('have.attr', 'style', 'color: blue;');
  }

  verifyUserSession() {
    cy.getCookie(CONFIG.cookieName)
      .should('have.property', 'value', CONFIG.cookieSetValue)
      .and('have.length', CONFIG.cookieSetValue.length);
  }

  verifyDisconnectedSession() {
    cy.getCookie(CONFIG.cookieName)
      .should('have.property', 'value', CONFIG.cookieUnsetValue)
      .and('have.length', CONFIG.cookieUnsetValue.length);
  }

  signOut() {
    this.dashboardElements.logoutLink().click();
  }
}

export const dashboardPage = new DashboardPage();