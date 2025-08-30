import { BasePage } from "./BasePage";

const CONFIG = {
  cookieName: "express:sess",
  cookieSetValue: "eyJmbGFzaCI6e30sInVzZXJuYW1lIjoicHJhY3RpY2UifQ==",
  cookieUnsetValue: "eyJmbGFzaCI6e319",
};

class DashboardPage extends BasePage {
  private readonly dashboardSelectors = {
    usernameGreeting: "#username",
    coreContainer: "#core",
    logoutLink: 'a[href="/logout"]',
  } as const;

  protected dashboardElements = {
    greetingMessage: () =>
      cy.get(`${this.dashboardSelectors.usernameGreeting}`),
    coreContainer: () => cy.get(`${this.dashboardSelectors.coreContainer}`),
    logoutLink: () =>
      cy
        .get(`${this.dashboardSelectors.coreContainer}`)
        .find(`${this.dashboardSelectors.logoutLink}`),
  };

  verifyPageUrl() {
    cy.url().should(
      "eq",
      `${Cypress.config().baseUrl}${Cypress.env("dashboard_url")}`
    );
  }

  verifyPageLoaded() {
    this.verifyPageUrl();
    this.elements
      .baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot("Secure Dashboard Page", { scope: selector });
      });
  }

  verifyGreetingMessage(userName: string) {
    this.dashboardElements
      .greetingMessage()
      .should("be.visible")
      .contains(`Hi, ${userName}!`);
  }

  verifyUserSession() {
    cy.getCookie(CONFIG.cookieName)
      .should("have.property", "value", CONFIG.cookieSetValue)
      .and("have.length", CONFIG.cookieSetValue.length);
  }

  verifyDisconnectedSession() {
    cy.getCookie(CONFIG.cookieName)
      .should("have.property", "value", CONFIG.cookieUnsetValue)
      .and("have.length", CONFIG.cookieUnsetValue.length);
  }

  signOut() {
    this.dashboardElements.logoutLink().click();
  }
}

export const dashboardPage = new DashboardPage();
