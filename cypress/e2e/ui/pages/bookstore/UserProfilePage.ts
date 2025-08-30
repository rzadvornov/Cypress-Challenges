import { BasePage } from "../BasePage";

class UserProfilePage extends BasePage {
  private userProfileSelectors = {
    navbarDropdown: "#navbarDropdown",
    profile: "#profile",
    logout: "#logout",
    deleteOrdersButton: "#deleteOrdersBtn",
    cardFooter: ".card-footer",
    totalAmountSpan: "span",
  } as const;

  protected userProfileElements = {
    menu: () => cy.get(`${this.userProfileSelectors.navbarDropdown}`),
    profile: () => cy.get(`${this.userProfileSelectors.profile}`),
    logout: () => cy.get(`${this.userProfileSelectors.logout}`),
    deleteOrdersButton: () =>
      cy.get(`${this.userProfileSelectors.deleteOrdersButton}`),
  };

  logout() {
    this.elements.baseContainer().then(($container) => {
      if (
        $container.find(this.userProfileSelectors.navbarDropdown).length > 0
      ) {
        this.userProfileElements.menu().click();
        this.userProfileElements.logout().click();
      }
    });
  }

  verifyPageUrl() {
    cy.url().should(
      "include",
      `${Cypress.config().baseUrl}${Cypress.env("bookstore_url")}${Cypress.env(
        "profile_url"
      )}`
    );
  }

  verifyPageLoaded(): void {
    this.verifyPageUrl();
  }

  verifyOrder() {
    this.verifyNotification();
    this.userProfileElements
      .deleteOrdersButton()
      .parent()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot("User Profile Page", { scope: selector });
      });
  }

  verifyTotalAmount(totalAmount: string) {
    cy.get("@extractedOrderID").then((orderID) => {
      cy.get(`[data-testid="${orderID}"]`)
        .find(`${this.userProfileSelectors.cardFooter}`)
        .find(`${this.userProfileSelectors.totalAmountSpan}`)
        .should("be.visible")
        .invoke("text")
        .should("eq", totalAmount);
    });
  }

  private verifyNotification() {
    this.getAlert()
      .should("be.visible")
      .and("contain", "Your purchase was successful! Thank you for your order.")
      .invoke("text")
      .then((text) => {
        const match = text.match(/Reference ID: ([a-f0-9]+)/i);
        if (match && match[1]) {
          const orderID = match[1].trim();
          cy.log(`Extracted Order ID: ${orderID}`);
          cy.wrap(orderID).as("extractedOrderID");
        } else {
          throw new Error("Could not extract Reference ID from alert text");
        }
      });
  }

  verifyMenuElements() {
    this.userProfileElements
      .menu()
      .should("be.visible")
      .invoke("text")
      .should("have.length.gt", 0);
    this.userProfileElements.profile().should("exist").contains("Profile");
    this.userProfileElements.logout().should("exist").contains("Log Out");
  }
}

export const userProfilePage = new UserProfilePage();
